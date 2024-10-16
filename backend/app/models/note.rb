class Note < ApplicationRecord
  belongs_to :user

  validates :title, length: { maximum: 64 }
  validates :body, length: { maximum: 5000 }
end
