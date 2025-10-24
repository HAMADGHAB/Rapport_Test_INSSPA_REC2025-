import { test, expect } from '@playwright/test';

// Version CI-friendly des tests
test.describe('Tests INSSPA - Version CI', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation robuste avec gestion d'erreurs
    try {
      await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
    } catch (error) {
      console.log('Navigation initiale échouée, tentative de rechargement...');
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
  });

  test('Test basique de chargement de la page', async ({ page }) => {
    // Test simple sans téléchargement
    await expect(page.locator('body')).toBeVisible();
    
    // CORRECTION: Use a more specific selector
    // Option 1: Target the first specific registration link
    await expect(page.getByRole('link', { name: '     التسجيل في مناظرة إنتداب طبيب بيطري صحي   ' })).toBeVisible();
    
    // OR Option 2: Use first() to get the first matching element
    // await expect(page.getByRole('link', { name: /التسجيل/ }).first()).toBeVisible();
    
    // OR Option 3: Check that at least one registration link exists
    // await expect(page.getByRole('link', { name: /التسجيل/ })).toHaveCount(10);

    console.log('✅ Page chargée avec succès en CI');
  });

  test('Test formulaire vétérinaire (sans téléchargement)', async ({ page }) => {
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: '     التسجيل في مناظرة إنتداب طبيب بيطري صحي   ' }).click();
    const page1 = await page1Promise;
    
    await page1.waitForLoadState('domcontentloaded');
    
    // Remplissage basique sans téléchargement
    await page1.locator('#cin').fill('11223344');
    await page1.getByRole('textbox', { name: 'تاريخ صدورها: ( إجباري )' }).fill('2020-01-01');
    
    // Vérification que le formulaire se remplit
    await expect(page1.locator('#cin')).toHaveValue('11223344');
    
    console.log('✅ Formulaire vétérinaire rempli en CI');
  });
});