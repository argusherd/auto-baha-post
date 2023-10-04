import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateLoginTable1696413563502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "logins",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "account",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "logged_in",
            type: "boolean",
          },
          {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("logins");
  }
}
