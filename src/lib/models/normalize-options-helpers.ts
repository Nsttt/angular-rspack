import assert from 'node:assert';
import { statSync } from 'node:fs';
import {
  basename,
  dirname,
  extname,
  join,
  normalize,
  posix,
  relative,
  resolve,
} from 'node:path';
import {
  findProjectForPath,
  normalizeProjectRoot,
} from '../utils/find-project-for-path';
import { retrieveOrCreateProjectGraph } from '../utils/graph';
import { workspaceRoot, type ProjectGraphProjectNode } from '../utils/workspace';
import type {
  AssetElement,
  GlobalEntry,
  NormalizedAssetElement,
  ScriptOrStyleEntry,
} from './angular-rspack-plugin-options';

export function normalizeAssetPatterns(
  assets: AssetElement[],
  root: string,
  projectRoot: string,
  projectSourceRoot: string | undefined
): NormalizedAssetElement[] {
  if (assets.length === 0) {
    return [];
  }

  const resolvedSourceRoot = projectSourceRoot
    ? join(workspaceRoot, projectSourceRoot)
    : join(workspaceRoot, projectRoot, 'src');

  return assets.map((assetPattern) => {
    if (typeof assetPattern === 'string') {
      const assetPath = normalize(assetPattern);
      const resolvedAssetPath = resolve(root, assetPath);

      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(
          `The ${assetPattern} asset path must start with the project source root.`
        );
      }

      let glob: string;
      let input: string;
      let isDirectory = false;

      try {
        isDirectory = statSync(resolvedAssetPath).isDirectory();
      } catch {
        isDirectory = true;
      }

      if (isDirectory) {
        glob = '**/*';
        input = assetPath;
      } else {
        glob = basename(assetPath);
        input = dirname(assetPath);
      }

      const output = relative(resolvedSourceRoot, resolve(root, input));
      assetPattern = { glob, input, output };
    } else {
      assetPattern.output = join('.', assetPattern.output ?? '');
    }

    assert(assetPattern.output !== undefined);

    if (assetPattern.output.startsWith('..')) {
      throw new Error(
        'An asset cannot be written to a location outside of the output path.'
      );
    }

    return assetPattern as NormalizedAssetElement;
  });
}

export function normalizeGlobalEntries(
  rawEntries: ScriptOrStyleEntry[] | undefined,
  defaultName: string
): GlobalEntry[] {
  if (!rawEntries?.length) {
    return [];
  }

  const bundles = new Map<string, GlobalEntry>();

  for (const rawEntry of rawEntries) {
    const entry: ScriptOrStyleEntry =
      typeof rawEntry === 'string' ? { input: rawEntry } : rawEntry;
    const { bundleName, input, inject = true } = entry;
    const name =
      bundleName || (inject ? defaultName : basename(input, extname(input)));
    const existing = bundles.get(name);

    if (!existing) {
      bundles.set(name, { name, files: [input], initial: inject });
      continue;
    }

    if (existing.initial !== inject) {
      throw new Error(
        `The "${name}" bundle is mixing injected and non-injected entries. ` +
          'Verify that the project options are correct.'
      );
    }

    existing.files.push(input);
  }

  return [...bundles.values()];
}

export async function getProject(root: string): Promise<
  | {
      name?: string;
      data: {
        name?: string;
        root: string;
        sourceRoot?: string;
      };
    }
  | undefined
> {
  const projectGraph = await retrieveOrCreateProjectGraph();
  let projectName = process.env['ANGULAR_RSPACK_PROJECT'];
  if (projectGraph) {
    if (!projectName) {
      const projectRootMappings = createProjectRootMappings(projectGraph.nodes);
      projectName =
        findProjectForPath(
          posix.relative(workspaceRoot, root),
          projectRootMappings
        ) ?? undefined;
    }

    if (projectName) {
      return projectGraph.nodes[projectName];
    }
  }
  return {
    name: undefined,
    data: {
      name: undefined,
      root: posix.relative(workspaceRoot, root) || '.',
      sourceRoot: undefined,
    },
  };
}

function createProjectRootMappings(
  nodes: Record<string, ProjectGraphProjectNode>
): Map<string, string> {
  const projectRootMappings = new Map<string, string>();
  for (const projectName of Object.keys(nodes)) {
    const root = nodes[projectName].data.root;
    projectRootMappings.set(normalizeProjectRoot(root), projectName);
  }
  return projectRootMappings;
}
