class Lesson
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Slug

  # field <name>, :type => <type>, :default => <value>

  field :title, :type => String
  field :description, :type => String
  field :files, :type => Array
  field :url_video, :type => String
  field :order, :type => Integer

  slug :title



  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  belongs_to :section
end
