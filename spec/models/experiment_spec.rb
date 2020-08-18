describe Experiment do
  describe '#choose_bandit_variant' do
    let(:experiment) do
      e = described_class.create!(name: 'test', url: 'www.google.com')
      e.variants << Variant.new(title: 'test', description: 'test')
      e.variants << Variant.new(title: 'test', description: 'test')
      e
    end

    let(:variant1) { experiment.variants.first }
    let(:variant2) { experiment.variants.last }

    let(:choose_100_times) do
      v1_count = 0
      v2_count = 0
      100.times do
        v = experiment.choose_bandit_variant
        if v == variant1
          v1_count += 1
        elsif v == variant2
          v2_count += 1
        end
      end

      [v1_count, v2_count]
    end

    it "chooses a variant" do
      expect(experiment.choose_bandit_variant).to be_a Variant
    end

    it "chooses new ones first" do
      variant1.share_counter.reset(100)
      variant1.allowed_goal_counter.reset(100)

      choices = choose_100_times
      expect(choices[1]).to be > 90
    end

    it "chooses equally between equally performing" do
      variant1.share_counter.reset(100)
      variant1.allowed_goal_counter.reset(100)
      variant2.share_counter.reset(100)
      variant2.allowed_goal_counter.reset(100)

      choices = choose_100_times
      expect(choices[0]).to be > 40
      expect(choices[1]).to be > 40
    end

    it "chooses equally between equally performing" do
      variant1.share_counter.reset(100)
      variant1.allowed_goal_counter.reset(100)
      variant2.share_counter.reset(100)
      variant2.allowed_goal_counter.reset(90)

      choices = choose_100_times
      expect(choices[0]).to be > 70
      expect(choices[1]).to be > 5
    end
  end

  describe '#index_of_max' do
    test_cases = [
      [[1, 0], 0],
      [[0, 1], 1],
      [[], nil],
      [[1, 2, 3], 2],
      [[2, 3, 1], 1],
      [[1.5, 2.5], 1],
      [[-2, 3, 8], 2],
      [[3, 1, -1], 0]
    ]

    test_cases.each do |tc|
      it "returns #{tc[1]} for #{tc[0]}" do
        expect(described_class.new.index_of_max(tc[0])).to eq tc[1]
      end
    end
  end
end
