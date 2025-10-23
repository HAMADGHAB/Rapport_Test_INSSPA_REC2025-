import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Inscription ingénieur principal avec validation complète', async ({ page }) => {
  const dossierTelechargements = './telechargements';
  const timestamp = Date.now();
  const cinUnique = `11${timestamp.toString().slice(-6)}`;

  try {
    // Configuration du dossier de téléchargements
    if (!fs.existsSync(dossierTelechargements)) {
      fs.mkdirSync(dossierTelechargements, { recursive: true });
    }

    console.log('🚀 Démarrage du test d\'inscription ingénieur...');
    
    await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
    
    // Ouvrir le formulaire d'inscription
    const promessePage1 = page.waitForEvent('popup');
    await page.getByRole('link', { name: '    التسجيل في مناظرة إنتداب مهندس أول ' }).click();
    const page1 = await promessePage1;
    
    await page1.waitForLoadState('networkidle');

    // Vérifier que nous sommes sur la bonne page
    await expect(page1.getByText('تسجيل مطلب ترشح للمشاركة في المناظرة الخارجية لإنتداب مهندسين أول بعنوان سنة')).toBeVisible();

    // Remplir les informations personnelles
    console.log('👤 Remplissage des informations personnelles...');
    await page1.locator('#cin').fill(cinUnique);
    await page1.getByRole('textbox', { name: 'تاريخ صدورها: ( إجباري )' }).fill('2020-01-01');
    await page1.locator('#prenom').fill('مهندس');
    await page1.locator('#nom').fill('لقب');
    await page1.locator('#date_naissance').fill('1990-01-01');
    await page1.locator('#sexe').selectOption('متزوج / متزوجة');
    await page1.locator('#email').fill('mail@mail.com');
    await page1.locator('#adresse').fill('عنوان');
    await page1.locator('#cp').fill('1000');
    await page1.locator('#gouv').selectOption('ولاية الكاف');
    await page1.locator('input[name="tel1"]').fill('22554477');
    await page1.locator('input[name="tel2"]').fill('22664488');

    // Remplir les informations académiques
    console.log('🎓 Remplissage des informations académiques...');
    await page1.getByRole('spinbutton', { name: 'سنة الحصول على شهادة البكالوريا: ( إجباري )' }).fill('2018');
    await page1.getByLabel('شعبة البكالوريا: ( إجباري )').selectOption('علوم الإعلامية');
    await page1.getByRole('spinbutton', { name: 'معدل البكالوريا: ( إجباري )', exact: true }).fill('15.5');
    await page1.getByRole('spinbutton', { name: 'تأكيد معدل البكالوريا: ( إجباري )' }).fill('15.5');
    await page1.getByLabel('الإختصاص: (إجباري)').selectOption('حماية النباتات');
    await page1.getByRole('spinbutton', { name: 'سنة التخرج: ( إجباري )' }).fill('2023');
    await page1.locator('#fac_ing').selectOption('عام');
    await page1.locator('#nom-etablissement').fill('المدرسة الوطنية للهندسة الفلاحية');
    await page1.getByRole('spinbutton', { name: 'المعدل العام لسنوات الدراسة بمرحلة تكوين المهندسين: ( إجباري )', exact: true }).fill('14');
    await page1.getByRole('spinbutton', { name: 'تأكيد المعدل العام لسنوات الدراسة بمرحلة تكوين المهندسين: ( إجباري )' }).fill('14');

    // Sélectionner les préférences de recrutement
    console.log('🏢 Sélection des préférences de recrutement...');
    await page1.getByLabel('جهة الترشح: (إجباري)').selectOption('الإدارة المركزية');
    await page1.getByLabel('التخصص المطلوب للترشح: (إجباري)').selectOption('حماية النباتات');

    // Soumettre le formulaire
    console.log('📤 Soumission du formulaire...');
    await page1.getByRole('button', { name: 'تسجيل' }).click();

    // Attendre le succès et gérer le téléchargement
    console.log('⏳ Attente du téléchargement...');
    const promesseTelechargement = page1.waitForEvent('download');
    await page1.getByRole('button', { name: 'حسنًا' }).click();
    const telechargement = await promesseTelechargement;

    // Sauvegarder le fichier
    const cheminFichier = path.join(dossierTelechargements, `candidature_ingenieur_${cinUnique}.pdf`);
    await telechargement.saveAs(cheminFichier);
    
    expect(fs.existsSync(cheminFichier)).toBeTruthy();
    console.log(`✅ Test réussi ! Fichier sauvegardé: ${cheminFichier}`);

  } catch (erreur) {
    console.error('❌ Échec du test:', erreur);
    await page.screenshot({ path: path.join(dossierTelechargements, `erreur_${Date.now()}.png`) });
    throw erreur;
  }
});