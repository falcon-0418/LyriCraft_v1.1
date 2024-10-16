FactoryBot.define do
  factory :user_authentication do
    uid { "123456789" }
    provider { "google_oauth2" }
    association :user
  end
end