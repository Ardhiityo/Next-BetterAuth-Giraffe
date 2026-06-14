import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    // semua permission bawaan plugin masuk
    ...defaultStatements
    
    // bisa tambah resource custom di sini
    // post: ["create", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const USER = ac.newRole({});

export const ADMIN = ac.newRole({
    /**
    Dengan ...adminAc.statements:
    Kamu meng-inherit semua permission bawaan admin plugin, lalu bisa menambah/override di atasnya. Lebih aman karena permission internal plugin sudah pasti    ada, dan kamu tinggal extend untuk kebutuhan custom.
     */
    ...adminAc.statements,
});
