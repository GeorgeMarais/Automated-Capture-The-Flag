"use client";

import React, { useState, useEffect } from 'react';

const ScraperComponent: React.FC = () => {
    const [hiddenUrl, setHiddenUrl] = useState<string>('https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/636861');
    const [flag, setFlag] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [displayFlag, setDisplayFlag] = useState<string>('');

    useEffect(() => {
        // Step 1: Fetch the hidden URL from the initial endpoint
        const fetchHiddenUrl = async () => {
            try {
                const response = await fetch('https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge');
                const text = await response.text();

                // Parse the HTML content using DOMParser
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                let url = '';
                const codeTags = doc.querySelectorAll('code[data-class^="23"]');
                codeTags.forEach((codeTag) => {
                    const div = codeTag.querySelector('div[data-tag$="93"]');
                    if (div) {
                        const spanTags = div.querySelector('span[data-id*="21"]');
                        if (spanTags) {
                            const iconTags = spanTags.querySelectorAll('i.char');
                            iconTags.forEach((iconTag) => {
                                const character = iconTag.getAttribute('value');
                                if (character && character.trim() !== '') {
                                    url += character;
                                }
                            });
                        }
                    }
                });

                setHiddenUrl(url);
            } catch (error) {
                console.error('Error fetching the hidden URL:', error);
            }
        };

        fetchHiddenUrl();
    }, []);

    useEffect(() => {
        if (hiddenUrl) {
            // Step 2: Fetch the flag from the hidden URL
            const fetchFlag = async () => {
                try {
                    const response = await fetch('https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/636861');
                    const flagText = await response.text();
                    setFlag(flagText.trim()); // Ensure any extra whitespace is removed
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching the flag:', error);
                }
            };

            fetchFlag();
        }
    });

    useEffect(() => {
        if (flag) {
            // Step 3: Simulate typewriter effect
            let index = 0;
            const interval = setInterval(() => {
                setDisplayFlag((prev) => prev + (flag[index] || ''));
                index++;
                if (index === flag.length) {
                    clearInterval(interval);
                }
            }, 500); // 500ms delay between each character

            return () => clearInterval(interval);
        }
    }, [flag]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Flag Display</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {displayFlag.split('').map((char, index) => (
                        <li key={index}>{char}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ScraperComponent;
