Rails.application.routes.draw do
  root to: redirect('/experiments')
  resources :experiments

  constraints :user_agent => /facebookexternalhit/ do
    get '/e/:experiment_id' => 'experiments#metatags'
  end
  get '/e/:experiment_id' => 'experiments#redirect'  

end
