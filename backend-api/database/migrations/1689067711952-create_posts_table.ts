import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePostsTable_1689067711952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "posts",
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
            isNullable: true,
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "demonstratio",
            type: "interger",
            isNullable: true,
          },
          {
            name: "sub_board",
            type: "interger",
            isNullable: true,
          },
          {
            name: "subject",
            type: "interger",
            isNullable: true,
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            isNullable: true,
          },
          {
            name: "scheduled_at",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "published_at",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "publish_failed",
            type: "varchar",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["board_id"],
            referencedTableName: "boards",
            referencedColumnNames: ["id"],
            onDelete: "set null",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("posts");
  }
}
