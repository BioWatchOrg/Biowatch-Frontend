export type AuthMessageKey =
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordMin'
  | 'fullNameRequired'
  | 'confirmPasswordRequired'
  | 'passwordMismatch'
  | 'loginError'
  | 'signupError'
  | 'forgotError'
  | 'forgotSuccess'
  | 'loadingLogin'
  | 'loadingSignup'
  | 'loadingForgot'
  | 'actionLogin'
  | 'actionSignup'
  | 'actionForgot';

const authMessages: Record<AuthMessageKey, string> = {
  emailRequired: "L'email est requis.",
  emailInvalid: 'Veuillez saisir une adresse email valide.',
  passwordRequired: 'Le mot de passe est requis.',
  passwordMin: 'Le mot de passe doit contenir au moins 8 caracteres.',
  fullNameRequired: 'Le nom complet est requis.',
  confirmPasswordRequired: 'Veuillez confirmer votre mot de passe.',
  passwordMismatch: 'Les mots de passe ne correspondent pas.',
  loginError: 'Connexion impossible pour le moment. Reessayez.',
  signupError: 'Creation de compte impossible pour le moment. Reessayez.',
  forgotError: "Envoi de l'email de recuperation impossible pour le moment.",
  forgotSuccess: 'Email de recuperation envoye. Verifiez votre boite mail.',
  loadingLogin: 'Connexion en cours...',
  loadingSignup: 'Creation du compte en cours...',
  loadingForgot: "Envoi de l'email en cours...",
  actionLogin: 'Se connecter',
  actionSignup: 'Creer un compte',
  actionForgot: "Envoyer l'email de recuperation",
};

export function getAuthMessage(key: AuthMessageKey): string {
  return authMessages[key];
}