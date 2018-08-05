Rails.application.routes.draw do
  root to: 'home#show'

  get 'login', to: redirect('/auth/google_oauth2'), as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'home', to: 'home#show'
  get 'me', to: 'me#show', as: 'me'

  resources :experiments

  constraints :user_agent => /facebookexternalhit|WhatsApp/ do
    get '/e/:id' => 'experiments#metatags'
  end
  get '/e/:id' => 'experiments#redirect'

  get '/experiments/:id/metatags' => 'experiments#metatags'

  get '/experiments/:id/demo' => 'experiments#demo'
  get '/experiments/:id/results' => 'experiments#results', as: 'experiment_results'
  get '/experiments/:id/image' => 'experiments#image', as: 'experiment_image'

  namespace :api, constraints: { format: 'json' } do
    get '/variant' => 'api#variant'
    post '/record_goal' => 'api#record_goal'
  end

  get '/scripts/script.js' => 'scripts#script'

end
