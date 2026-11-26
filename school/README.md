# Activer l'espace professeur — Micro-Collège

Le mode local des deux jeux reste indépendant. Le mode classe est désactivé tant que `school-config.js` ne contient pas l'URL du service. Aucun élève réel avant validation de l'établissement et de son DPD.

## Installation (Cloudflare Workers + D1, offre Free)

1. Dans le compte Cloudflare de l'établissement, créer une base D1 nommée `micro-college`, avec juridiction **UE** (option de localisation contraignante et non simple préférence). Si nécessaire, avec Wrangler : `npx wrangler d1 create micro-college --jurisdiction eu`. Ne pas activer la réplication mondiale. Vérifier les conditions de traitement, les sous-traitants et les transferts avec le DPD.
2. Exécuter le fichier [schema.sql](schema.sql) dans la console D1. Créer un Worker JavaScript de type module et remplacer le code par [worker.js](worker.js).
3. Dans les réglages du Worker, ajouter une liaison D1 nommée exactement `DB` vers cette base.
4. Définir **en tant que secrets** (pas de variables publiques) : `AUTH_PEPPER` (32 caractères aléatoires minimum) et `ADMIN_SECRET` (24 caractères aléatoires minimum). Générer deux valeurs différentes avec un gestionnaire de mots de passe. Ne pas les mettre dans GitHub ni les transmettre dans une conversation. Conserver les secrets en lieu sûr ; changer AUTH_PEPPER invalide les mots de passe et sessions existants.
5. Déployer le Worker. Vérifier l'URL publique HTTPS avec `/health` : elle doit répondre `{"ok":true,"version":1,"configured":true}`. Ceci vérifie les liaisons, pas la totalité de l'API.
6. Dans le dépôt GitHub, modifier uniquement `school-config.js` : `window.MICRO_COLLEGE_API = 'https://nom-du-worker.sous-domaine.workers.dev';` (sans barre finale). L'URL est publique, jamais les secrets.
7. Ouvrir https://julienlegrand19-lab.github.io/Micro-College/professeur.html et se connecter avec ADMIN_SECRET. Créer deux comptes de test fictifs. Le tableau de bord fournit le lien des jeux en mode classe.

## Recette avant utilisation réelle

- Vérifier création, connexion, rejet d'un mauvais mot de passe, absence d'accès professeur pour un compte élève.
- Jouer un niveau avec le compte fictif A, revenir à la carte et se déconnecter. Reprendre depuis un autre navigateur. Tester passage au second chapitre, armures, personnalisation et progression.
- Vérifier qu'un élève B ne voit pas A. Réinitialiser le mot de passe A et vérifier l'invalidation de son ancienne session et la conservation de sa progression.
- Tester export CSV et suppression complète du compte A. Vérifier que les comptes supprimés ne peuvent plus se connecter.
- Vérifier les quotas gratuits, la sauvegarde pendant une panne et les limites de taille. Les sauvegardes réseau nécessitent une connexion et une navigation après sauvegarde réussie ; fermeture brutale et panne ne garantissent pas la toute dernière action.
- Contrôler les journaux et désactiver la journalisation de requêtes contenant des données scolaires ; aucun mot de passe, token ou contenu de sauvegarde ne doit être journalisé. Fixer une durée de conservation, procédure de suppression et sauvegarde de la base.
- Les statistiques sont déclarées par le jeu et ne constituent pas des notes certifiées. Les anciens profils locaux ne sont pas migrés automatiquement.

Mode local : accès classique aux jeux. Mode classe : `campagne.html?school=1` et `pyramides.html?school=1`.
