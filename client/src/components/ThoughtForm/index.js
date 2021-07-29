import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

function ThoughtForm() {
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    function handleChange(event) {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    async function handleFormSubmit(event) {
        event.preventDefault();

        try {
            await addThought({
                variables: { thoughtText }
            });

            setText('');
            setCharacterCount(0);
        }
        catch(e) {
            console.error(e);
        }
    };

    const [addThought, {error}] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
            try {
                // read what's currently in cache
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

                // prepend newest thought to front of array
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            }
            catch(e) {
                console.error(e);
            }

            // update me's object cache appending new thought to end of array
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought]}}
            });
        }
    });

    return(
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ThoughtForm;