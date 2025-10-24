flowchart TD
    Start[App Launch] --> InitConfig[Initialize Theming and I18n]
    InitConfig --> HomeScreen[HomeScreen]
    HomeScreen -->|Fetch Data| FetchPosts[Get Posts and Categories]
    FetchPosts -->|Success| DisplayHome[Display Featured Carousel and Post List]
    FetchPosts -->|Error| HomeError[Show Error View with Retry]
    HomeError -->|Retry| FetchPosts
    DisplayHome -->|Select Post| PostDetail[PostDetailScreen]
    DisplayHome -->|Toggle Language| ChangeLang[Change App Language]
    ChangeLang --> InitConfig
    PostDetail -->|Fetch Detail| FetchDetail[Fetch Post Content]
    FetchDetail -->|Success| DisplayDetail[Render HTML Content]
    FetchDetail -->|Error| DetailError[Show Error View with Retry]
    DetailError -->|Retry| FetchDetail
    DisplayDetail -->|Back| HomeScreen
    HomeScreen -->|Select Category| CategoryScreen[CategoriesScreen]
    CategoryScreen -->|Fetch Posts| FetchCategory[Get Category Posts]
    FetchCategory -->|Success| DisplayCategory[Display Posts List]
    FetchCategory -->|Error| CategoryError[Show Error View with Retry]
    CategoryError -->|Retry| FetchCategory
    DisplayCategory -->|Select Post| PostDetail