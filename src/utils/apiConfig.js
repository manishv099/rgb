const API_BASE_URL = 'https://api.rgbplay.in';

const API_ADMIN = '/admin';
const API_USER = '/user';
const API_VERSION_V1 = '/v1';

export const API_URLS = {
  userSignup: '/userSignup',
  userSignin: '/userSignin',
  userGameHistory: '/user_game_history',
  getGameDetails: '/get_game_details',
  chooseColor: '/choose_color',
  activeGame: '/active_game',
  findNextGame: '/find_next_game',
  deactivateGame: '/deactivate_game',
  winGame: '/win_game',
  userDetails: '/user_details',
  userTransactionHistory: '/user_transaction_history',
  userAmountRequest: '/user_amount_request',
  userList: '/user_list',
  gameDetails: '/game_details',
  adminSignin: '/adminSignin',
  adminUserHistory: '/adminUserHistory',
  adminSattle: '/adminSattle',
  adminTransactionHistory: '/adminTransactionHistory',
  forgetPassword: '/forgetPassword'
};

export const getAdminApiUrl = (endpoint) => {
  return `${API_BASE_URL}${API_ADMIN}${API_VERSION_V1}${API_URLS[endpoint]}`;
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${API_USER}${API_VERSION_V1}${API_URLS[endpoint]}`;
};
