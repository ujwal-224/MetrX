import prisma from '../config/prisma.js';
import { seedDatabase } from '../routes/seedRoutes.js';

async function cleanReset() {
  console.log('[MetrX DB Reset] Starting database cleanup for presentation...');

  try {
    // 1. Delete Inspection Check Results and Inspection Records
    await prisma.inspectionCheckResult.deleteMany({});
    console.log('✓ Cleared Inspection Check Results');

    await prisma.inspectionRecord.deleteMany({});
    console.log('✓ Cleared Inspection Records');

    // 2. Delete Certificates
    await prisma.certificate.deleteMany({});
    console.log('✓ Cleared Certificates');

    // 3. Delete Verifications
    await prisma.verification.deleteMany({});
    console.log('✓ Cleared Verification Requests');

    // 4. Delete Instruments
    await prisma.instrument.deleteMany({});
    console.log('✓ Cleared Registered Instruments');

    // 5. Delete Shops
    await prisma.shop.deleteMany({});
    console.log('✓ Cleared Registered Shops / Merchants');

    // 6. Delete non-admin Users
    await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin123@metrx.com'
        }
      }
    });
    console.log('✓ Cleared Non-Admin Users (Inspectors & Shop Owners)');

    // 7. Ensure Super-Admin Account and standard Legal Metrology rules exist
    await seedDatabase();
    console.log('✓ Ensured Super-Admin account and standard Legal Metrology Verification Rules');

    console.log('\n[MetrX DB Reset] Database successfully reset and ready for presentation!');
  } catch (error) {
    console.error('[MetrX DB Reset Error]', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanReset();
