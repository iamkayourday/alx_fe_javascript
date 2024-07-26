// ARRAY OF QUOTES OBJECTS || RANDOM QUOTES.
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.', 
      category: 'Education' },
    { text: 'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.', 
      category: 'Love' },
    { text: 'You will face many defeats in life, but never let yourself be defeated.', 
      category: 'Resilience' },
    { text: 'In the end, it’s not the years in your life that count. It’s the life in your years.', 
      category: 'Life' },
    { text: 'Life is a succession of lessons which must be lived to be understood.', 
      category: 'Life' },
    { text: 'Only a life lived for others is a life worthwhile.', 
      category: 'Philanthropy' },
    { text: 'Life is what happens when you’re busy making other plans.', 
      category: 'Life' },
    { text: 'Go confidently in the direction of your dreams! Live the life you’ve imagined.', 
      category: 'Dreams' },
    { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', 
      category: 'Resilience' },
    { text: 'Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma — which is living with the results of other people’s thinking.', 
      category: 'Self-Improvement' },
    { text: 'You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.', 
      category: 'Empowerment' },
    { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", 
      category: 'Persistence' },
    { text: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere.", 
      category: 'Persistence' },
    { text: 'The way to get started is to quit talking and begin doing.', 
      category: 'Action' },
    { text: 'I failed my way to success.', 
      category: 'Failure' },
    { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", 
      category: 'Ambition' },
    { text: 'A successful man is one who can lay a firm foundation with the bricks others have thrown at him.', 
      category: 'Success' },
    { text: 'You know you are on the road to success if you would do your job and not be paid for it.', 
      category: 'Success' },
    { text: 'If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work.', 
      category: 'Excellence' }
  ];

  // DOM
  document.addEventListener('DOMContentLoaded', () => {
    const newQuotebtn = document.getElementById('newQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteBtn = document.getElementById('addQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const importQuote = document.getElementById('importFile');
    const exportQuote = document.getElementById('exportQuote');
    const categoryFilter = document.getElementById('categoryFilter');

  // SAVE QUOTES IN ARRAY TO LOCALSTORAGE
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }
  
    // SHOW RANDOM QUOTES
    newQuotebtn.addEventListener('click', () => {
      function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        if (quoteDisplay) {
          quoteDisplay.innerHTML = `${randomQuote.text} — ${randomQuote.category}`;
        }
      }
      showRandomQuote();
    });
  
    // ALLOW USERS TO ADD NEW QUOTES
    addQuoteBtn.addEventListener('click', () => {
      function createAddQuoteForm() {
        const newQuote = newQuoteText.value.trim();
        const newCategory = newQuoteCategory.value.trim();
  
        if (newQuote && newCategory) {
          quotes.push({
            text: newQuote,
            category: newCategory
          });
          saveQuotes(); // Save quotes to local storage after adding
          populateCategories(); // Update categories in the dropdown
          console.log(quotes)
          newQuoteText.value = '';
          newQuoteCategory.value = '';
          alert('New quote successfully added!');
        } else {
          alert('Please fill in both the quote and category fields!');
        }
      }
      createAddQuoteForm();
    });
  
    // IMPORT QUOTES TOJSON FILE
    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); // Save imported quotes to local storage
        alert('Quotes imported successfully!');
        populateCategories(); 
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    // EXPORT QUOTES TO JSON FILE
    function exportToJsonFile() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      a.click();
      alert('Quotes exported successfully!');
    }
  
    // Populate categories dynamically
    function populateCategories() {
      categoryFilter.innerHTML = '<option value="All">All Categories</option>'; // Reset the dropdown
      const categories = [...new Set(quotes.map(quote => quote.category))];
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
  
      // Restore the last selected category from local storage
      const lastSelectedCategory = localStorage.getItem('selectedCategory');
      if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
      } else {
        categoryFilter.value = 'All'; 
      }
      filterQuotes(); 
    }
  
    // Filter quotes based on the selected category
    function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      const filteredQuotes = quotes.filter(quote => selectedCategory === 'All' || quote.category === selectedCategory);
  
      quoteDisplay.innerHTML = '';
      filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.textContent = `${quote.text} — ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
      });
  
      // Save the last selected category to local storage
      localStorage.setItem('selectedCategory', selectedCategory);
    }

    // GET FROM SERVER
    const urlApi = 'https://jsonplaceholder.typicode.com/posts'
  
    async function fetchQuotesFromServer () {
      const fetchQuotes = await fetch(urlApi);
      const data = await fetchQuotes.json();
      localStorage.setItem('data',JSON.stringify(data) )// NOT WORKING(server quotes not displaying)!!! 
      quotes.push(...data);
      console.log(quotes);//server quotes showing in the console but not on browswer
      
    }
    
    // POST TO SERVER
    async function postQuoteToServer(quote) {
      await fetch(urlApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quote),
      });
    }
    
    function syncQuotes() {
      alert(`Quotes synced with server!`); //🤔🤔🤔...........
    }

    fetchQuotesFromServer();
    postQuoteToServer();
    setInterval(fetchQuotesFromServer, 300000)//Try to set interval before fetchquotefrom server and see later
    populateCategories(); 
    filterQuotes(); 
    importQuote.addEventListener('change', importFromJsonFile);
    exportQuote.addEventListener('click', exportToJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
  });