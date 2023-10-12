import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDemonstratiosTable1697016951708
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "demonstratios",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "board_id",
            type: "integer",
          },
          {
            name: "value",
            type: "varchar",
          },
          {
            name: "text",
            type: "varchar",
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
    await queryRunner.dropTable("demonstratios");
  }
}
