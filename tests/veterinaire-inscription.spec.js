import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Soumission du formulaire d\'inscription vétérinaire', async ({ page }) => {
  const timestamp = Date.now();
  const cinUnique = `11${timestamp.toString().slice(-6)}`;
  const dossierTelechargements = './telechargements';
  
  // Créer le dossier de téléchargements
  if (!fs.existsSync(dossierTelechargements)) {
    fs.mkdirSync(dossierTelechargements, { recursive: true });
  }

  await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
  
  const promessePage1 = page.waitForEvent('popup');
  await page.getByRole('link', { name: '     التسجيل في مناظرة إنتداب طبيب بيطري صحي   ' }).click();
  const page1 = await promessePage1;
  
  await page1.waitForLoadState('domcontentloaded');

  // Remplir tous les champs du formulaire
  await page1.locator('#cin').fill(cinUnique);
  await page1.getByRole('textbox', { name: 'تاريخ صدورها: ( إجباري )' }).fill('2020-01-01');
  await page1.locator('#prenom').fill('اسم');
  await page1.locator('#nom').fill('لقب');
  await page1.locator('#date_naissance').fill('1990-01-01');
  await page1.locator('#sexe').selectOption('أعزب / عزباء');
  await page1.locator('#email').fill('mail.exemple@mail.com');
  await page1.locator('#adresse').fill('عنوان شخصي');
  await page1.locator('#cp').fill('1000');
  await page1.locator('#gouv').selectOption('ولاية سيدي بوزيد');
  await page1.locator('input[name="tel1"]').fill('99889988');
  await page1.locator('input[name="tel2"]').fill('99556622');
  await page1.locator('#fac_ing').selectOption('وطنية');
  await page1.locator('input[name="diplome_titre[]"]').fill('شهادة');
  await page1.locator('input[name="diplome_annee[]"]').fill('2023');
  await page1.locator('input[name="diplome_etablissement[]"]').fill('مؤسسة');
  await page1.locator('input[name="achghal_sujet[]"]').fill('اشغال');
  await page1.locator('input[name="achghal_annee[]"]').fill('2024');
  await page1.locator('input[name="achghal_etablissement[]"]').fill('مؤسسة');
  await page1.locator('input[name="stage_sujet[]"]').fill('تريص');
  await page1.locator('input[name="stage_annee[]"]').fill('2022');
  await page1.locator('input[name="stage_etablissement[]"]').fill('مؤسسة');
  await page1.getByLabel('جهة الترشح: (إجباري)').selectOption('MED');
  
  await page1.getByRole('button', { name: 'تسجيل' }).click();

  await expect(page1.getByText('لقد تم تسجيل مطلبكم بنجاح')).toBeVisible({ timeout: 10000 });

  const promesseTelechargement = page1.waitForEvent('download');
  await page1.getByRole('button', { name: 'حسنًا' }).click();
  const telechargement = await promesseTelechargement;
  
  const cheminFichier = path.join(dossierTelechargements, `candidature_${cinUnique}.pdf`);
  await telechargement.saveAs(cheminFichier);
});