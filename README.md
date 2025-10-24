Rapport de Test Playwright

Nom du projet :
Test automatisé du site INSSPA Recrutement 2025

Testeur / Analyste :
Hamad Ghabri

Outils de test :
Playwright (framework d’automatisation web)
Node.js (environnement d’exécution JavaScript)
VS Code (éditeur de code)
Git (gestion de version)

Prérequis :
Avant d’exécuter les tests :

Installer Node.js (version 18 ou supérieure).
Installer Git et VS Code.
Cloner le projet depuis GitHub :
git clone https://github.com/HAMADGHAB/Rapport_Test_INSSPA_REC2025-.git
cd Rapport_Test_INSSPA_REC2025-

Installer les dépendances nécessaires :
npm install
npx playwright install

Vérifications importantes après l’installation de Playwright :
Pendant ou après l’installation, Playwright peut créer automatiquement un dossier de test nommé tests, e2e ou similaire.
➜ Il faut supprimer ce dossier immédiatement après l’installation.
Conserver uniquement le dossier tests provenant du dépôt GitHub cloné, car c’est lui qui contient les scripts officiels du projet.
Supprimer également le fichier example.spec.js, qui est créé par défaut par Playwright lors de la première installation.
➜ Ce fichier se trouve généralement dans le dossier tests ou e2e généré automatiquement.
➜ Supprime aussi tout autre dossier créé automatiquement par Playwright, car le dépôt GitHub contient déjà tous les fichiers nécessaires.
Vérifier qu’il n’existe qu’un seul fichier playwright.config.js dans le projet.
➜ S’il y en a deux, conserver uniquement celui du projet cloné depuis GitHub.

Alternative d’installation locale (si vous ne clonez pas le projet complet)
Créer manuellement un dossier sur votre poste de travail nommé :
TEST_INSSPA
Télécharger uniquement le dossier tests depuis le dépôt GitHub :
  **** https://github.com/HAMADGHAB/Rapport_Test_INSSPA_REC2025-
Copier le dossier tests dans le dossier "TEST_INSSPA".
Ouvrir VS Code, puis :
Cliquer sur Fichier > Ouvrir un dossier
Sélectionner "TEST_INSSPA"
Vérifier que vous êtes bien dans le dossier TEST_INSSPA (où se trouve le dossier tests contenant les scripts).

Installer Node.js et Playwright :
npm init -y
npm install -D @playwright/test@latest
npx playwright install


Lancer les tests :

npx playwright test --ui

Cas de test :

Ouverture du site : Vérifier que la page http://193.95.84.7/concours/recrutement_insspa_2025/ s’affiche correctement.

Navigation : Vérifier le fonctionnement des menus et liens.

Formulaires d’inscription :

Vérifier le chargement du formulaire.

Remplir tous les champs obligatoires.

Soumettre et vérifier le message de confirmation.

Accessibilité : Contrôler l’accès clavier et la présence des attributs ARIA.

Performance : Mesurer le temps de chargement et la stabilité de la page.

Résultat du test :

Les tests fonctionnent correctement en local.

Les erreurs sur GitHub Actions sont dues à l’adresse IP interne (193.95.84.7), inaccessible à distance.

En local, les tests réussissent après ajustement du paramètre waitUntil (domcontentloaded).

Les rapports HTML sont générés dans le dossier playwright-report.

Guide d’exécution locale (PC) :

Ouvrir le projet dans VS Code :

code .


Installer les navigateurs Playwright (si non installés) :

npx playwright install


Exécuter les tests avec interface graphique :

npx playwright test --ui


Afficher le rapport HTML après l’exécution :

npx playwright show-report


Avant chaque nouvelle exécution :
  Supprimer les anciens dossiers de résultats :

rm -rf test-results playwright-report

    Conclusion :
Les tests automatisés Playwright du projet INSSPA Recrutement 2025 sont pleinement opérationnels en environnement local.
La suppression des fichiers et dossiers générés automatiquement par Playwright est essentielle pour éviter les conflits avec les tests du projet.
Le dossier cloné depuis GitHub contient déjà tous les fichiers nécessaires à l’exécution.
La procédure alternative permet également une configuration manuelle claire et rapide.
