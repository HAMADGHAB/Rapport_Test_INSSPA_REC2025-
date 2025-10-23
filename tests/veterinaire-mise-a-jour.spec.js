import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Mise à jour inscription vétérinaire avec téléchargement', async ({ page }) => {
  const dossierTelechargements = './telechargements';
  const numeroCIN = '11043873';
  
  try {
    // Créer le dossier de téléchargements
    if (!fs.existsSync(dossierTelechargements)) {
      fs.mkdirSync(dossierTelechargements, { recursive: true });
      console.log(`📁 Dossier de téléchargements créé: ${dossierTelechargements}`);
    }

    console.log('🌐 Navigation vers la page de candidature...');
    await page.goto('http://193.95.84.7/concours/recrutement_insspa_2025/');
    
    console.log('🔗 Clic sur le lien de mise à jour...');
    await page.getByRole('link', { name: 'تحيين التسجيل   ' }).first().click();
    
    console.log('📝 Remplissage des informations d\'identification...');
    await page.getByRole('textbox', { name: 'إدخل رقم بطاقة التعريف الوطنية' }).fill(numeroCIN);
    await page.locator('#dateCin_veterinaire').fill('2020-01-01');
    await page.getByRole('button', { name: 'تحيين' }).click();
    
    console.log('⏳ Attente de la confirmation de succès...');
    await expect(page.getByRole('heading', { name: 'نجاح' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('تم العثور على البيانات، سيتم توجيهك إلى صفحة التحيين')).toBeVisible();
    await page.getByRole('button', { name: 'متابعة' }).click();
    
    console.log('📋 Attente du formulaire de mise à jour...');
    await expect(page.getByRole('heading', { name: /تحيين بطاقة ترشح للمشاركة في المناظرة/ })).toBeVisible();
    
    // Mettre à jour les informations
    console.log('📞 Mise à jour du numéro de téléphone...');
    await page.locator('input[name="tel1"]').fill('99889977');
    
    console.log('🎓 Ajout d\'un nouveau diplôme...');
    await page.getByRole('button', { name: '+ إضافة شهادة جديدة' }).click();
    await page.locator('input[name="diplome_titre[]"]').nth(1).fill('شهادة 1');
    await page.getByRole('spinbutton').nth(1).fill('2023');
    await page.locator('input[name="diplome_etablissement[]"]').nth(1).fill('مؤسسة 1');
    
    console.log('💼 Ajout d\'une nouvelle expérience professionnelle...');
    await page.getByRole('button', { name: '+ إضافة عمل جديد' }).click();
    await page.locator('input[name="achghal_sujet[]"]').nth(1).fill('أشغال 1');
    await page.getByRole('spinbutton').nth(3).fill('2020');
    await page.locator('input[name="achghal_etablissement[]"]').nth(1).fill('مؤسسة');
    
    console.log('🔬 Ajout d\'un nouveau stage...');
    await page.getByRole('button', { name: '+ إضافة تربص جديد' }).click();
    await page.locator('input[name="stage_sujet[]"]').nth(1).fill('تربص 1');
    await page.getByRole('spinbutton').nth(5).fill('2024');
    await page.locator('input[name="stage_etablissement[]"]').nth(1).fill('مؤسسة 1');
    
    console.log('🚀 Soumission de la mise à jour et attente du téléchargement...');
    const promesseTelechargement = page.waitForEvent('download');
    await page.getByRole('button', { name: 'تحيين' }).click();
    const telechargement = await promesseTelechargement;
    
    // Générer un nom de fichier unique
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nomSuggere = telechargement.suggestedFilename();
    const nomFichier = nomSuggere 
      ? `mise_a_jour_${nomSuggere}`
      : `candidature_${numeroCIN}_${timestamp}.pdf`;
    
    const cheminFichier = path.join(dossierTelechargements, nomFichier);
    
    console.log(`💾 Sauvegarde du téléchargement vers: ${cheminFichier}`);
    await telechargement.saveAs(cheminFichier);
    
    // Vérifier le téléchargement
    expect(fs.existsSync(cheminFichier)).toBeTruthy();
    const stats = fs.statSync(cheminFichier);
    expect(stats.size).toBeGreaterThan(0);
    
    console.log(`✅ Téléchargement réussi !`);
    console.log(`📄 Fichier: ${cheminFichier}`);
    console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (erreur) {
    console.error('❌ Échec du test:', erreur);
    
    // Prendre un screenshot en cas d'échec
    await page.screenshot({ 
      path: path.join(dossierTelechargements, `erreur_${Date.now()}.png`),
      fullPage: true 
    });
    console.log('📸 Screenshot sauvegardé pour débogage');
    
    throw erreur;
  }
});