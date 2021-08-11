"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210811014118 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210811014118 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
    }
}
exports.Migration20210811014118 = Migration20210811014118;
//# sourceMappingURL=Migration20210811014118.js.map