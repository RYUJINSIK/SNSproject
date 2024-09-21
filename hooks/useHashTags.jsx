import { useState, useCallback } from "react";

const useHashtags = (initialHashtags = []) => {
  const [hashtags, setHashtags] = useState(initialHashtags);
  const [hashtagInput, setHashtagInput] = useState("");

  const handleHashtagInputChange = useCallback((e) => {
    setHashtagInput(e.target.value);
  }, []);

  const addHashtag = useCallback(() => {
    const trimmedInput = hashtagInput.trim();
    if (trimmedInput) {
      const newTag = trimmedInput.startsWith("#")
        ? trimmedInput
        : `#${trimmedInput}`;

      setHashtags((prevTags) => {
        if (!prevTags.includes(newTag)) {
          return [...prevTags, newTag];
        }
        return prevTags;
      });
      setHashtagInput("");
    }
  }, [hashtagInput]);

  const handleHashtagInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addHashtag();
      }
    },
    [addHashtag]
  );

  const removeHashtag = useCallback((tagToRemove) => {
    setHashtags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  return {
    hashtags,
    setHashtags,
    hashtagInput,
    handleHashtagInputChange,
    handleHashtagInputKeyDown,
    addHashtag,
    removeHashtag,
  };
};

export default useHashtags;
