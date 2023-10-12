import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSubBoardsTable1697020515829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sub_boards",
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
    await queryRunner.dropTable("sub_boards");
  }
}
