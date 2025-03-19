const { convert } = require('html-to-text');

function convertHtmlToText(html) {
    const options = {
        wordwrap: 100,
        selectors: [
            { selector: 'code', options: { wordwrap: false } },
            { selector: 'pre', format: 'blockquote' },
            { selector: 'ul', options: { itemPrefix: '• ' } },
            { selector: 'ol', options: { itemPrefix: '%n. ' } },
            { selector: 'sup', format: 'superscript' }
        ],
        formatters: {
            superscript: function(elem, walk, builder, formatOptions) {
                builder.addInline('^' + elem.children.map(child => {
                    if (child.type === 'text') return child.data;
                    return '';
                }).join(''));
            },
            blockquote: function(elem, walk, builder, formatOptions) {
                builder.openBlock({ leadingLineBreaks: 2 });
                builder.addInline('```\n');
                walk(elem.children, builder);
                builder.addInline('\n```');
                builder.closeBlock({ trailingLineBreaks: 2 });
            }
        }
    };
    
    return convert(html, options);
}

function getFormattedQuestionContent(questionTitleSlug) {
    return getQuestionContent(questionTitleSlug)
        .then(question => {
            if (question && question.content) {
                return {
                    ...question,
                    formattedContent: convertHtmlToText(question.content)
                };
            }
            return question;
        });
}

function getQuestionContent (questionTitleSlug) {
    return fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `query questionContent($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                    content
                    titleSlug
                }
            }`,
            variables: {
                titleSlug: questionTitleSlug
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        return data.data.question;
    })
    .catch(error => {
        console.error('Error fetching question content:', error);
        throw error;
    });
};

function getListOfQuestions(categorySlug = '', limit = 50, skip = 0, filters = {}) {
    return fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      topicTags {
        name
        id
        slug
      }
      hasSolution
      hasVideoSolution
    }
  }
}`,
            variables: {
                categorySlug,
                limit,
                skip,
                filters
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        return data.data.problemsetQuestionList;
    })
    .catch(error => {
        console.error('Error fetching question list:', error);
        throw error;
    });
}

module.exports = {
    getQuestionContent,
    getListOfQuestions,
    convertHtmlToText,
    getFormattedQuestionContent
};

