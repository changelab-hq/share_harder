module ApplicationHelper
  def docs_template
    return unless lookup_context.find_all(lookup_context.prefixes[0..-2].join('/') + '/docs/_' + request[:action]).any?

    lookup_context.prefixes[0..-2].join('/') + '/docs/' + request[:action] # needs an underscore for path
  end
end
