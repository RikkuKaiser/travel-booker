import { AppDataSource } from '../data-source';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../modules/users/entities/user-role.entity';
import * as bcrypt from 'bcrypt';

async function runSeed() {
  try {
    const dataSource = await AppDataSource.initialize();

    const rolesRepo = dataSource.getRepository(Role);
    const rolesData = [
      { name: 'ADMIN', description: 'Administrator role with full access' },
      { name: 'AGENT', description: 'Agent role with limited access' },
      { name: 'VIEWER', description: 'Viewer role with read-only access' },
    ];

    for (const role of rolesData) {
      const existing = await rolesRepo.findOneBy({ name: role.name });
      if (!existing) {
        await rolesRepo.save(rolesRepo.create(role));
      }
    }

    const usersRepo = dataSource.getRepository(User);
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    let adminUser = await usersRepo.findOneBy({ email: 'admin@admin.com' });
    if (!adminUser) {
      adminUser = usersRepo.create({
        name: 'Admin',
        email: 'admin@admin.com',
        passwordHash,
      });
      await usersRepo.save(adminUser);
    }

    const userRolesRepo = dataSource.getRepository(UserRole);
    const adminRole = await rolesRepo.findOneBy({ name: 'ADMIN' });

    if (adminRole && adminUser) {
      const exists = await userRolesRepo.findOneBy({
        userId: adminUser.id,
        roleId: adminRole.id,
      });
      if (!exists) {
        const userRole = userRolesRepo.create({
          user: adminUser,
          role: adminRole,
          userId: adminUser.id,
          roleId: adminRole.id,
        });
        await userRolesRepo.save(userRole);
      }
    }

    console.log('✅ Seed ejecutado correctamente.');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  }
}

runSeed();
