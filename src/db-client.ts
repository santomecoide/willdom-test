import { Pool } from 'pg';

class DbClient {
    private static instance: DbClient;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            user: 'test-assignment',
            password: 'gfdjh24m,sddsf',
            host: 'test-instance-1-cluster.cluster-cys30lik4v4w.us-east-1.rds.amazonaws.com',
            port: 5432,
            database: 'test_assignment',
        });
  }

  public static getInstance(): DbClient {
    if (!DbClient.instance) {
        DbClient.instance = new DbClient();
    }
    return DbClient.instance;
  }

  public getConnection() {
    return this.pool;
  }
}

export default DbClient;