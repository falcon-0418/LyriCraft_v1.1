class AddUserIdToNotes < ActiveRecord::Migration[7.1]
  def change
    add_column :notes, :user_id, :integer
    add_index :notes, :user_id
    add_foreign_key :notes, :users
  end
end
