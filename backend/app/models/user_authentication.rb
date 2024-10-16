class UserAuthentication < ApplicationRecord
  belongs_to :user

  validates :uid, presence: true, uniqueness: { scope: :provider }
  validates :provider, presence: true
end
