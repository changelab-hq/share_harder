describe Font do
  describe '#wrap_text' do
    [
      { text: "", px_width: 100, result: "" },
      { text: "This doesn't wrap", px_width: 1000, result: "This doesn't wrap" },
      { text: "This wraps each word", px_width: 36, result: "This\nwraps\neach\nword" },
      { text: "This wraps two words", px_width: 72, result: "This wraps\ntwo words" },
      { text: "This word is longissssssssssssimo", px_width: 60, result: "This word\nis\nlongissssssssssssimo" },
      { text: "Width is too short", px_width: 1, result: "Width\nis\ntoo\nshort" },
      { text: "Width is zero", px_width: 0, result: "Width\nis\nzero" }
    ].each do |test_case|
      it %(correctly wraps "#{test_case[:text]}" with px_width #{test_case[:px_width]}) do
        expect(Font.new('./spec/support/Abril Fatface.tff').wrap_text(test_case[:text], test_case[:px_width], 12)).to eq test_case[:result]
      end
    end
  end
end
