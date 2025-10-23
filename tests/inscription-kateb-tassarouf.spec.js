import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test d'inscription pour le concours de Kateb Tassarouf pour la Santé Publique
 * Vérifie le processus complet d'inscription avec validation
 */
test('Inscription Kateb Tassarouf pour la Santé Publique', async ({ page }) => {
  const dossierTelechargements = './telechargements';
  const timestamp = Date.now();
  const cinUnique = `11${timestamp.toString().slice(-6)}`;

  try {
    // === CONFIGURATION INITIALE ===
    if (!fs.existsSync(dossierTelechargements)) {
      fs.mkdirSync(dossierTelechargements, { recursive: true });
      console.log(`📁 Dossier de téléchargements créé: ${dossierTelechargements}`);
    }

    console.log('🚀 Démarrage de l\'inscription Kateb Tassarouf...');
    
    // === NAVIGATION VERS LA PLATEFORME ===
    await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
    
    // === OUVERTURE DU FORMULAIRE ===
    console.log('🔗 Ouverture du formulaire d\'inscription...');
    const promesseNouvellePage = page.waitForEvent('popup');
    await page.getByRole('link', { name: '     التسجيل في مناظرة إنتداب كاتب تصرف للصحة العمومية ' }).click();
    const pageFormulaire = await promesseNouvellePage;
    
    await pageFormulaire.waitForLoadState('domcontentloaded');

    // === VÉRIFICATION DE LA PAGE ===
    await expect(pageFormulaire.getByText('تسجيل مطلب ترشح للمشاركة في المناظرة الخارجية لإنتداب كتاب تصرف للصحة العمومية ب')).toBeVisible();

    // === SECTION INFORMATIONS PERSONNELLES ===
    console.log('👤 Remplissage des informations personnelles...');
    
    // Identification
    await pageFormulaire.locator('#cin').fill(cinUnique);
    await pageFormulaire.getByRole('textbox', { name: 'تاريخ صدورها: ( إجباري )' }).fill('2020-01-01');
    
    // État civil
    await pageFormulaire.locator('#prenom').fill('كاتب');
    await pageFormulaire.locator('#nom').fill('الكاتب');
    await pageFormulaire.locator('#date_naissance').fill('1990-01-01');
    await pageFormulaire.locator('#sexe').selectOption('أرمل / أرملة');
    
    // Coordonnées
    await pageFormulaire.locator('#email').fill('mail@mail.com');
    await pageFormulaire.locator('#adresse').fill('عنوان شخصي');
    await pageFormulaire.locator('#cp').fill('1000');
    await pageFormulaire.locator('#gouv').selectOption('ولاية القصرين');
    await pageFormulaire.locator('input[name="tel1"]').fill('11559977');
    await pageFormulaire.locator('input[name="tel2"]').fill('99551122');

    // === SECTION INFORMATIONS ACADÉMIQUES ===
    console.log('🎓 Remplissage des informations académiques...');
    
    await pageFormulaire.getByLabel('الشهادة العلمية: (إجباري)').selectOption('شهادة البكالوريا');
    await pageFormulaire.getByLabel('شعبة البكالوريا: ( إجباري )').selectOption('علوم الإعلامية');
    await pageFormulaire.getByRole('spinbutton', { name: 'سنة الحصول على شهادة البكالوريا: ( إجباري )' }).fill('2017');
    await pageFormulaire.getByRole('spinbutton', { name: 'معدل البكالوريا: ( إجباري )', exact: true }).fill('12.6');
    await pageFormulaire.getByRole('spinbutton', { name: 'تأكيد معدل البكالوريا: ( إجباري )' }).fill('12.6');

    // === SOUMISSION DU FORMULAIRE ===
    console.log('📤 Soumission du formulaire...');
    await pageFormulaire.getByRole('button', { name: 'تسجيل' }).click();

    // === VÉRIFICATION DU SUCCÈS ===
    console.log('⏳ Vérification de l\'enregistrement...');
    await expect(pageFormulaire.getByRole('heading', { name: 'تم التسجيل بنجاح' })).toBeVisible({ timeout: 10000 });
    await expect(pageFormulaire.getByText('لقد تم تسجيل مطلبكم بنجاح')).toBeVisible();

    // === GESTION DU TÉLÉCHARGEMENT ===
    console.log('💾 Téléchargement de la confirmation...');
    const promesseTelechargement = pageFormulaire.waitForEvent('download');
    await pageFormulaire.getByRole('button', { name: 'حسنًا' }).click();
    const telechargement = await promesseTelechargement;

    // === SAUVEGARDE DU FICHIER ===
    const nomFichier = `inscription_kateb_tassarouf_${cinUnique}.pdf`;
    const cheminFichier = path.join(dossierTelechargements, nomFichier);
    await telechargement.saveAs(cheminFichier);
    
    // === VÉRIFICATIONS FINALES ===
    expect(fs.existsSync(cheminFichier)).toBeTruthy();
    const stats = fs.statSync(cheminFichier);
    expect(stats.size).toBeGreaterThan(0);
    
    console.log(`✅ Inscription réussie !`);
    console.log(`📄 Fichier sauvegardé: ${cheminFichier}`);
    console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (erreur) {
    console.error('❌ Échec de l\'inscription:', erreur);
    
    // Capture d'écran en cas d'échec
    try {
      const cheminScreenshot = path.join(dossierTelechargements, `erreur_kateb_${Date.now()}.png`);
      await page.screenshot({ path: cheminScreenshot });
      console.log(`📸 Capture d'écran sauvegardée: ${cheminScreenshot}`);
    } catch (screenshotError) {
      console.log('⚠️ Impossible de capturer l\'écran');
    }
    
    throw erreur;
  }
});