import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Inscription technicien avec validation', async ({ page }) => {
  const dossierTelechargements = './telechargements';
  const timestamp = Date.now();
  const cinUnique = `11${timestamp.toString().slice(-6)}`;

  try {
    // Configuration du dossier de téléchargements
    if (!fs.existsSync(dossierTelechargements)) {
      fs.mkdirSync(dossierTelechargements, { recursive: true });
      console.log(`📁 Dossier de téléchargements créé: ${dossierTelechargements}`);
    }

    console.log('🌐 Démarrage du test d\'inscription technicien...');
    
    await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
    
    // Ouvrir le formulaire d'inscription
    console.log('🔗 Ouverture du formulaire d\'inscription...');
    const promessePage1 = page.waitForEvent('popup');
    await page.getByRole('link', { name: '     التسجيل في مناظرة إنتداب تقني ' }).click();
    const page1 = await promessePage1;
    
    await page1.waitForLoadState('networkidle');

    // Vérifier que nous sommes sur la bonne page
    await expect(page1.getByText('تسجيل مطلب ترشح للمشاركة في المناظرة الخارجية لإنتداب تقنيين بعنوان سنة')).toBeVisible();

    // Remplir les informations personnelles
    console.log('👤 Remplissage des informations personnelles...');
    await page1.locator('#cin').fill(cinUnique);
    await page1.getByRole('textbox', { name: 'تاريخ صدورها: ( إجباري )' }).fill('2020-01-01');
    await page1.locator('#prenom').fill('أسم تقني');
    await page1.locator('#nom').fill('لقب');
    await page1.locator('#date_naissance').fill('1992-01-01');
    await page1.locator('#sexe').selectOption('مطلق / مطلقة');
    await page1.locator('#email').fill('exampl@mail.com');
    await page1.locator('#adresse').fill('عنوان شخصي');
    await page1.locator('#cp').fill('1002');
    await page1.locator('#gouv').selectOption('ولاية بـاجة');
    await page1.locator('input[name="tel1"]').fill('77884411');
    await page1.locator('input[name="tel2"]').fill('22331144');

    // Remplir les informations académiques
    console.log('🎓 Remplissage des informations académiques...');
    await page1.getByRole('spinbutton', { name: 'سنة الحصول على شهادة البكالوريا: ( إجباري )' }).fill('2019');
    await page1.getByLabel('شعبة البكالوريا: ( إجباري )').selectOption('إقتصاد و تصرف');
    await page1.getByRole('spinbutton', { name: 'معدل البكالوريا: ( إجباري )', exact: true }).fill('16');
    await page1.getByRole('spinbutton', { name: 'تأكيد معدل البكالوريا: ( إجباري )' }).fill('16');

    await page1.locator('#diplome').selectOption('تقني سام أو شهادة معترف بمعادلتها');
    await page1.getByLabel('الإختصاص: (إجباري)').selectOption('صناعات غذائية');
    await page1.getByRole('spinbutton', { name: 'سنة التخرج: ( إجباري )' }).fill('2022');
    await page1.locator('#type_ecole').selectOption('خاص');
    await page1.locator('#nom_ecole').fill('مؤسسة خاصة');
    await page1.getByRole('textbox', { name: 'تاريخ الحصول على شهادة المعادلة: (إجباري للمؤسسات الخاصة)' }).fill('2023-01-01');
    await page1.getByRole('spinbutton', { name: 'المعدل العام لسنوات الدراسة بالتعليم العالي أو معدل سنة الحصول على شهادة التكوين المهني : ( إجباري )', exact: true }).fill('14');
    await page1.getByRole('spinbutton', { name: 'تأكيد المعدل العام لسنوات الدراسة بالتعليم العالي أو معدل سنة الحصول على شهادة ا' }).fill('14');

    // Remplir les préférences de recrutement
    console.log('🏢 Sélection des préférences de recrutement...');
    await page1.getByLabel('جهة الترشح: (إجباري)').selectOption('القيروان');
    await page1.getByLabel('التخصص المطلوب للترشح: (إجباري)').selectOption('صناعات غذائية');

    console.log('🚀 Soumission du formulaire...');
    await page1.getByRole('button', { name: 'تسجيل' }).click();

    // Attendre le succès et le téléchargement
    console.log('⏳ Attente du téléchargement...');
    const promesseTelechargement = page1.waitForEvent('download');
    await page1.getByRole('button', { name: 'حسنًا' }).click();
    const telechargement = await promesseTelechargement;

    // Sauvegarder le fichier
    const nomFichier = `candidature_technicien_${cinUnique}.pdf`;
    const cheminFichier = path.join(dossierTelechargements, nomFichier);
    await telechargement.saveAs(cheminFichier);
    
    // Vérifier le téléchargement
    expect(fs.existsSync(cheminFichier)).toBeTruthy();
    const stats = fs.statSync(cheminFichier);
    expect(stats.size).toBeGreaterThan(0);
    
    console.log(`✅ Test réussi !`);
    console.log(`📄 Fichier sauvegardé: ${cheminFichier}`);
    console.log(`📊 Taille du fichier: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (erreur) {
    console.error('❌ Échec du test:', erreur);
    const cheminScreenshot = path.join(dossierTelechargements, `erreur_${Date.now()}.png`);
    await page.screenshot({ path: cheminScreenshot });
    console.log(`📸 Screenshot sauvegardé: ${cheminScreenshot}`);
    throw erreur;
  }
});