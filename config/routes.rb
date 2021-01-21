require 'repost'
Rails.application.routes.draw do
  root to: 'home#show'

  get 'login', to: redirect_post('/auth/google_oauth2'), as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')

  get 'home', to: 'home#show'
  get 'me', to: 'me#show', as: 'me'

  resources :experiments, except: [:show]
  get '/experiments/archived' => 'experiments#archived_index', as: 'archived_experiments'

  constraints user_agent: /facebookexternalhit|WhatsApp/ do
    get '/e/:id' => 'experiments#metatags'
  end
  get '/e/:id' => 'experiments#redirect', as: 'e'
  get '/e/:id/share' => 'experiments#share'

  get '/experiments/:id/metatags' => 'experiments#metatags'

  get '/experiments/:id/demo' => 'experiments#demo', as: 'experiment_demo'
  get '/experiments/:id/results' => 'experiments#results', as: 'experiment_results'
  post '/experiments/:id/clone' => 'experiments#clone', as: 'clone_experiment'
  post '/experiments/:id/archive' => 'experiments#archive', as: 'archive_experiment'

  resources :template_images
  get '/template_images/:id/image' => 'template_images#image', as: 'render_template_image'

  namespace :api, constraints: { format: 'json' } do
    get '/variant' => 'api#variant'
    post '/record_goal' => 'api#record_goal'
  end

  get '/scripts/script.js' => 'scripts#script'
end
