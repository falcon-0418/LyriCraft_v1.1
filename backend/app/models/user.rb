class User < ApplicationRecord
  has_one :user_authentication, dependent: :destroy
  has_many :notes, dependent: :destroy
end
