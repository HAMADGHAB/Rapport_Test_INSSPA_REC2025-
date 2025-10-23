import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test de mise à jour de l'inscription ingénieur
 * CIN: 11251191 - Date: 2020-01-01
 */
test('Mise à jour inscription ingénieur', async ({ page }) => {
  const dossierTelechargements = './telechargements';
  const numeroCIN = '11251191';

  try {
    // === CONFIGURATION ===
    if (!fs.existsSync(dossierTelechargements)) {
      fs.mkdirSync(dossierTelechargements, { recursive: true });
      console.log(`📁 Dossier créé: ${dossierTelechargements}`);
    }

    console.log('🚀 Démarrage mise à jour ingénieur...');
    
    // === NAVIGATION ===
    await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
    
    // === ACCÈS FORMULAIRE MISE À JOUR ===
    console.log('🔗 Accès formulaire mise à jour ingénieur...');
    await page.getByRole('link', { name: 'تحيين التسجيل   ' }).nth(1).click();
    
    // === IDENTIFICATION ===
    console.log('📝 Identification du candidat...');
    await page.getByRole('textbox', { name: 'إدخل رقم بطاقة التعريف الوطنية' }).fill(numeroCIN);
    await page.locator('#dateCin_ing').fill('2020-01-01');
    await page.getByRole('button', { name: 'تحيين' }).click();
    
    // === VÉRIFICATION SUCCÈS ===
    console.log('⏳ Vérification recherche...');
    await expect(page.getByRole('heading', { name: 'نجاح' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'متابعة' }).click();
    
    // === MISE À JOUR INFORMATIONS ===
    console.log('🔄 Mise à jour des informations...');
    
    // Modifier le prénom
    await page.locator('#prenom').fill('مهندس معدل');
    console.log('👤 Prénom mis à jour');
    
    // Modifier le nom
    await page.locator('#nom').fill('لقب معدل');
    console.log('👤 Nom mis à jour');
    
    // Modifier l'année du bac
    await page.getByRole('spinbutton', { name: 'سنة الحصول على شهادة البكالوريا: ( إجباري )' }).fill('2015');
    console.log('🎓 Année bac mise à jour: 2015');

    // === SOUMISSION ET TÉLÉCHARGEMENT ===
    console.log('🚀 Soumission des modifications...');
    const promesseTelechargement = page.waitForEvent('download');
    await page.getByRole('button', { name: 'تحيين' }).click();
    const telechargement = await promesseTelechargement;

    // === SAUVEGARDE ===
    console.log('💾 Sauvegarde du fichier...');
    const nomFichier = `mise_a_jour_ingenieur_${numeroCIN}.pdf`;
    const cheminFichier = path.join(dossierTelechargements, nomFichier);
    await telechargement.saveAs(cheminFichier);
    
    // === VÉRIFICATION ===
    expect(fs.existsSync(cheminFichier)).toBeTruthy();
    const stats = fs.statSync(cheminFichier);
    
    console.log(`✅ Mise à jour réussie !`);
    console.log(`📄 Fichier: ${cheminFichier}`);
    console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (erreur) {
    console.error('❌ Échec:', erreur);
    
    try {
      const cheminScreenshot = path.join(dossierTelechargements, `erreur_${Date.now()}.png`);
      await page.screenshot({ path: cheminScreenshot });
      console.log(`📸 Screenshot: ${cheminScreenshot}`);
    } catch (screenshotError) {
      console.log('⚠️ Impossible de capturer l\'écran');
    }
    
    throw erreur;
  }
});