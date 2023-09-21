import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFixedBoardIntoBoardsTable1695287899596
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO boards
            (no, name)
        VALUES
            ('60111', '測試區(Testing)')
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
