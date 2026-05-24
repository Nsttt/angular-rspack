import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parse } from 'jsonc-parser';

export interface ProjectGraphProjectNode {
  name: string;
  type: 'app' | 'lib' | 'e2e' | string;
  data: {
    name?: string;
    root: string;
    sourceRoot?: string;
    i18n?: unknown;
    [key: string]: unknown;
  };
}

export interface ProjectGraph {
  nodes: Record<string, ProjectGraphProjectNode>;
}

export const logger = {
  warn(message: string) {
    console.warn(message);
  },
  info(message: string) {
    console.info(message);
  },
  error(message: string) {
    console.error(message);
  },
};

export const workspaceRoot = findWorkspaceRoot(process.cwd());

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function findWorkspaceRoot(start: string): string {
  const envRoot = process.env['ANGULAR_RSPACK_WORKSPACE_ROOT'];
  if (envRoot) {
    return resolve(envRoot);
  }

  let current = resolve(start);
  let packageRoot: string | undefined;

  for (;;) {
    if (
      isFile(join(current, 'angular.json')) ||
      isFile(join(current, 'workspace.json'))
    ) {
      return current;
    }

    if (!packageRoot && isFile(join(current, 'package.json'))) {
      packageRoot = current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return packageRoot ?? resolve(start);
    }
    current = parent;
  }
}

export async function retrieveOrCreateProjectGraph(): Promise<ProjectGraph | null> {
  return readAngularWorkspaceGraph(workspaceRoot);
}

function readAngularWorkspaceGraph(root: string): ProjectGraph | null {
  const workspacePath = ['angular.json', 'workspace.json']
    .map((fileName) => join(root, fileName))
    .find((path) => existsSync(path));

  if (!workspacePath) {
    return null;
  }

  const workspace = parse(readFileSync(workspacePath, 'utf8')) as {
    projects?: Record<string, string | Record<string, unknown>>;
  };
  const nodes: Record<string, ProjectGraphProjectNode> = {};

  for (const [name, value] of Object.entries(workspace.projects ?? {})) {
    const project =
      typeof value === 'string' ? readProjectJson(root, value) : value;
    if (!project) {
      continue;
    }

    const projectRoot =
      typeof value === 'string'
        ? value
        : typeof project.root === 'string'
          ? project.root
          : '';
    const sourceRoot =
      typeof project.sourceRoot === 'string' ? project.sourceRoot : undefined;
    const projectType =
      project.projectType === 'application'
        ? 'app'
        : project.projectType === 'library'
          ? 'lib'
          : typeof project.projectType === 'string'
            ? project.projectType
            : 'app';

    nodes[name] = {
      name,
      type: projectType,
      data: {
        ...project,
        name,
        root: projectRoot,
        sourceRoot,
      },
    };
  }

  return { nodes };
}

function readProjectJson(
  root: string,
  projectRoot: string
): Record<string, unknown> | null {
  const projectJsonPath = join(root, projectRoot, 'project.json');
  if (!existsSync(projectJsonPath)) {
    return { root: projectRoot };
  }

  return parse(readFileSync(projectJsonPath, 'utf8')) as Record<
    string,
    unknown
  >;
}
