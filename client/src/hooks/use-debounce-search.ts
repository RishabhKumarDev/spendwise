import { useCallback, useEffect, useState } from "react";

interface UseDebouncedSearchOptions {
    delay?: number;
    immediate?: boolean;
}

function useDebouncedSearch(
    initialValue: string,
    options: UseDebouncedSearchOptions = {}
) {
    const { immediate = false, delay = 500 } = options;

    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [debouncedTerm, setDebouncedTerm] = useState(initialValue);

    const setSearchTermDebounced = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    useEffect(() => {
        if (immediate && searchTerm === initialValue) {
            setDebouncedTerm(searchTerm);
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, delay)

        return () => {
            clearTimeout(handler);
        }
    }, [immediate, searchTerm, initialValue, delay]);

    return { debouncedTerm, searchTerm, setSearchTerm: setSearchTermDebounced }
}

export default useDebouncedSearch