class Section
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Slug

  # field <name>, :type => <type>, :default => <value>

  field :title, :type => String

  slug :title
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  has_many :lessons
  belongs_to :course
end
