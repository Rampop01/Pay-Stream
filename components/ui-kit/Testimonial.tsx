import React from 'react';

export const Testimonial = ({ quote, author }: any) => <blockquote><p>"{quote}"</p><cite>- {author}</cite></blockquote>;