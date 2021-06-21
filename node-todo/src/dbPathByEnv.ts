const dbPaths: { [env: string]: string } = {
  test: 'db/testDb.json',
  dev: 'db/devDb.json',
  prod: 'db/prodDb.json'
};

export const dbPathByEnv = (): string => {
  const env = process.env.NODE_ENV || 'prod';
  return dbPaths[env];
};