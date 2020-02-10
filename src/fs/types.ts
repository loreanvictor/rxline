export interface PathFull {
  path: string;
}


export function isPathFull(whatever: any): whatever is PathFull {
  return whatever && whatever.path && typeof whatever.path === 'string';
}


export interface File<T> extends PathFull {
  content: T;
  root: string;
}


export function isFile<T>(whatever: any): whatever is File<T> {
  return isPathFull(whatever) && (whatever as any).root && typeof (whatever as any).root === 'string' && 
        'content' in whatever;
}


export interface FileModificationOptions {
  overwrite: boolean;
}
