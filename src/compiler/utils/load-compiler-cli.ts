let load;
export function loadCompilerCli(): Promise<
  typeof import('@angular/compiler-cli')
> {
  load ??= new Function('', `return import('@angular/compiler-cli');`);
  return load().catch((e: unknown) => {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Failed to load Angular Compiler CLI: ${message}`
    );
  });
}
