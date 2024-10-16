Rails.application.routes.draw do

  get 'auth/google_oauth2/callback', to: 'google_oauths#create'

  resource :google_one_tap, only: [:callback] do
    post 'callback', on: :collection
  end

  namespace :api, format: 'json' do
    namespace :v1 do
      resources :users, only: [] do
        get 'current', on: :collection
      end

      namespace :user do
        resources :notes, only: %i[index create show update destroy]
      end
    end
  end
end
