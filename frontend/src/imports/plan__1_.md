Build this following engineering best practices:

-   Write all code to WCAG AA accessibility standards

-   Create and use reusable components throughout

-   Use semantic HTML and proper component architecture

-   Avoid absolute positioning; use flexbox/grid layouts

-   Build actual code components, not image SVGs

-   Keep code clean, maintainable, and well-structured

I need you to build a complete application. Here\'s everything:

**PROJECT OVERVIEW:**

**Vietnamese RAG Poetry Generator**

**Product Structure Reference**

**1. App Type & Purpose**

**App Type**

A web-based AI poetry-writing application that uses
**Retrieval-Augmented Generation (RAG)** to generate original Vietnamese
poems.

The application combines:

-   A Vietnamese poetry database.

-   Semantic and keyword-based retrieval.

-   User-selected poetry constraints.

-   A generative language model.

-   A visual explanation of the poems used as contextual references.

The planned system follows this general architecture:

**User input → Query processing → Poetry retrieval → Context selection →
Poem generation → Generated poem and source display**

The frontend is planned with ReactJS, Tailwind CSS and Shadcn/ui, while
the backend uses FastAPI and a RAG pipeline.

**Purpose**

The application helps users turn a single poetic idea into a complete
Vietnamese poem.

It solves several problems:

1.  Users may have an opening verse but struggle to continue writing a
    complete poem.

2.  Users may not fully understand the rules of Vietnamese poetic forms.

3.  Users may want to create poetry inspired by a specific literary
    period or author.

4.  A normal language model may produce poems without clear literary
    references or relevant context.

5.  Users and researchers need to understand which existing poems
    influenced the generated result.

6.  The project team needs a practical interface for demonstrating and
    evaluating the RAG system.

**Target Users**

The main target users are:

-   Students interested in Vietnamese literature.

-   Beginner and hobbyist poetry writers.

-   Users seeking creative writing inspiration.

-   Teachers or learners exploring Vietnamese poetic forms.

-   Researchers or project evaluators studying retrieval and
    poem-generation performance.

**Interface Language**

The public user interface should use **Vietnamese**.

Examples:

-   "Nhập câu thơ mở đầu"

-   "Chọn thể thơ"

-   "Phong cách tác giả"

-   "Thời kỳ sáng tác"

-   "Tạo bài thơ"

-   "Các bài thơ tham khảo"

Technical terms such as retrieval method, embedding model, similarity
score and top-k should appear only inside an optional research or
advanced mode.

**2. Core Features**

**1. Opening Verse Input**

Users enter one original opening verse that becomes the starting point
of the generated poem.

This is the main required input of the system and should be presented as
a large, clearly visible text field.

**2. Poetry Form Selection**

Users select the poetic form that the generated poem should follow.

Supported forms may include:

-   Lục bát.

-   Song thất lục bát.

-   Four-syllable poetry.

-   Five-syllable poetry.

-   Six-syllable poetry.

-   Seven-syllable poetry.

-   Eight-syllable poetry.

-   Free verse.

The selected form is required and guides both retrieval and generation.

**3. Author and Literary Period Preferences**

Users can optionally specify:

-   A Vietnamese poet whose style they want to reference.

-   A literary period whose characteristics they want the poem to
    reflect.

The author field should support search or autocomplete, while the
literary period can use a dropdown selection.

These filters are optional and are currently combined using OR logic
with the poetry-form filter.

**4. RAG-Based Poetry Retrieval**

The system searches the Vietnamese poetry collection for poems related
to the user\'s opening verse and selected preferences.

The retrieval pipeline may use:

-   BM25.

-   Vector embeddings.

-   Hybrid retrieval.

-   HyDE.

-   Metadata filtering.

-   A vector database such as ChromaDB or FAISS.

The purpose of retrieval is to provide relevant poetic context before
the language model creates the new poem.

**5. AI Poem Generation**

The system combines the user\'s request with retrieved poetry context
and generates a new Vietnamese poem.

The output should attempt to follow:

-   The opening verse.

-   The selected poetic form.

-   The chosen author or period style.

-   The semantic direction of the retrieved context.

-   Appropriate continuity, vocabulary and poetic structure.

The result should be presented as a complete poem rather than as a
chatbot response.

**6. Retrieved Source Display**

Users can see the top-k poems used as context during generation.

Each source should display:

-   Poem title.

-   Author.

-   Literary period.

-   Poetry form.

-   Short excerpt.

-   Retrieval rank.

-   Matched characteristics.

-   Similarity or relevance score in research mode.

This feature makes the RAG process understandable and differentiates the
application from a standard AI poem generator.

**7. Result Actions and Generation History**

After a poem is generated, users can:

-   Copy the poem.

-   Regenerate another version.

-   Change the input settings.

-   Save the result.

-   Review previously generated poems.

-   Provide simple feedback.

For the MVP, history may be stored locally without requiring user
accounts.

**3. Main User Flow**

**Step 1: Open the Application**

The user arrives at the landing page and sees a simple introduction
explaining that the system can develop one opening verse into a complete
Vietnamese poem.

**Step 2: Start a New Poem**

The user selects the primary action, such as:

**"Bắt đầu sáng tác"**

The application opens the poem-generation workspace.

**Step 3: Enter the Opening Verse**

The user writes one original Vietnamese verse.

Example:

Trăng nghiêng qua mái hiên nhà

The interface validates that this field is not empty.

**Step 4: Select the Poetry Form**

The user selects a required poetry form, such as:

-   Lục bát.

-   Five-syllable poetry.

-   Seven-syllable poetry.

-   Free verse.

The interface may show a short description of the selected form.

**Step 5: Add Optional Style Preferences**

The user may optionally:

-   Enter an author\'s name.

-   Select a literary period.

-   Adjust the number of retrieved poems.

-   Open advanced settings.

Users who only want a quick result can skip this step.

**Step 6: Generate the Poem**

The user selects:

**"Tạo bài thơ"**

The system then:

1.  Processes the opening verse and filters.

2.  Searches the poetry database.

3.  Retrieves the top-k related poems.

4.  Builds a generation prompt using the retrieved context.

5.  Sends the prompt to the generation model.

6.  Produces a complete Vietnamese poem.

**Step 7: View Generation Progress**

During processing, the interface displays understandable progress
stages:

-   "Đang phân tích yêu cầu"

-   "Đang tìm bài thơ liên quan"

-   "Đang lựa chọn ngữ cảnh"

-   "Đang sáng tác bài thơ"

Technical backend terminology should remain hidden in the normal user
mode.

**Step 8: Read the Generated Poem**

The final poem appears in the central result area.

The result includes:

-   Generated title.

-   Full poem.

-   Selected poetic form.

-   Selected style information.

-   Generation actions.

**Step 9: Inspect Retrieved Sources**

The user can review the poems used as generation context.

Each source explains why it was selected, for example:

-   Same poetic form.

-   Same literary period.

-   Same requested author.

-   Similar meaning to the opening verse.

**Step 10: Continue or Finish**

The user can:

-   Copy the poem.

-   Save it.

-   Generate another version.

-   Refine the settings.

-   Start a new poem.

-   Open a previous result from history.

**User Flow Summary**

**Landing page → Enter opening verse → Select poetry form → Add optional
style preferences → Generate → Retrieve related poems → Generate poem →
Read result → Inspect sources → Save, copy or regenerate**

**4. Page Structure**

**1. Landing Page**

Introduces the Vietnamese AI poetry generator, explains its main benefit
and provides a clear action for starting a new poem.

**2. Poetry Generator**

The main workspace where users enter an opening verse, select poetry
constraints and request a generated poem.

**3. Generation Result**

Displays the generated poem, selected settings and actions such as copy,
save, refine and regenerate.

This screen may be integrated into the Poetry Generator page instead of
being implemented as a separate route.

**4. Retrieved Sources**

Shows the top-k Vietnamese poems used as RAG context, including
metadata, excerpts and explanations of why each result was selected.

This can be implemented as a right-side panel on desktop and an
accordion or drawer on mobile.

**5. Source Detail Screen**

Displays the extended content and metadata of one retrieved poem,
including author, period, poetic form, retrieval rank and matched
filters.

This should usually be a modal or side drawer rather than a full page.

**6. Generation History**

Lists previously generated poems and allows users to reopen, duplicate
or delete a result.

For the first version, the history can be stored locally in the browser.

**7. How It Works**

Explains the RAG pipeline using a simple visual flow from user input to
retrieval, context construction and poem generation.

**8. About the Project**

Presents the project objective, team information, dataset overview,
technical architecture and academic context.

The project\'s poetry corpus includes data from sources such as
Facebook, Tkaraoke, Thi Viện and Lục Bát.

**9. Research Mode**

Provides optional technical controls and information for project
demonstrations, including retrieval methods, top-k values, model
selection and relevance scores.

This mode should be separated from the standard creative experience so
that normal users are not overwhelmed by technical settings.

**5. Recommended MVP Page Set**

To keep development realistic, the first release should focus on five
main screens:

1.  **Landing Page** --- Introduces the product and starts the creation
    flow.

2.  **Poetry Generator** --- Collects the opening verse and poetry
    settings.

3.  **Generated Result** --- Displays the new poem and result actions.

4.  **Retrieved Sources Panel** --- Shows the poems used as context.

5.  **About / How It Works** --- Explains the project and its RAG
    pipeline.

The History and Research Mode screens can be added after the main
generation flow is working.

**6. Recommended Product Positioning**

The application should primarily feel like a **creative Vietnamese
poetry-writing tool**, not a technical chatbot or machine-learning
dashboard.

The normal interface should emphasize:

-   Creativity.

-   Vietnamese literature.

-   Readability.

-   Simplicity.

-   Inspiration.

-   Transparency of sources.

Technical controls should remain available through an optional section
titled:

**"Cài đặt nâng cao"** or **"Chế độ nghiên cứu"**

This structure allows the application to serve both general users and
project evaluators without making the primary experience unnecessarily
complex.

**ALL PAGES & DETAILED SPECIFICATIONS:**

**Vietnamese RAG Poetry Generator**

**Comprehensive Page and Screen Specification**

**1. Global Product Structure**

**1.1 Product Type**

A responsive web application that helps users generate original
Vietnamese poems using Retrieval-Augmented Generation.

The main system flow is:

**User request → Query processing → Poetry retrieval → Context selection
→ Poem generation → Generated poem and retrieved references**

The planned frontend uses ReactJS, Tailwind CSS and Shadcn/ui. The
backend uses FastAPI and a RAG pipeline connected to a Vietnamese poetry
database.

**1.2 Interface Language**

The public-facing interface should be written primarily in Vietnamese
because the product focuses on Vietnamese poetry and Vietnamese-speaking
users.

Technical labels such as embedding model, hybrid retrieval, similarity
score and top-k should appear only in advanced settings or Research
Mode.

**1.3 Global Navigation**

Recommended desktop navigation:

-   Trang chủ

-   Sáng tác

-   Lịch sử

-   Cách hoạt động

-   Về dự án

-   Chế độ nghiên cứu

Recommended mobile navigation:

-   Home icon: Trang chủ

-   Pen icon: Sáng tác

-   History icon: Lịch sử

-   Menu icon: More pages

**1.4 Global Header**

The header should contain:

-   Application logo.

-   Application name.

-   Main navigation.

-   Optional Research Mode indicator.

-   Optional light/dark appearance control.

-   Mobile navigation menu.

Suggested product-name placeholders:

-   Thi Vận AI

-   Mạch Thơ

-   Thi Hứng

-   Vần Việt

-   Việt Thi AI

**1.5 Global Footer**

The footer should contain:

-   Project name.

-   Short project description.

-   Team or university information.

-   Links to "Cách hoạt động" and "Về dự án".

-   Copyright or academic-use notice.

-   Dataset-source acknowledgement where appropriate.

**2. Page: Landing Page**

**Page Name**

**Trang chủ --- Landing Page**

**Purpose**

The Landing Page introduces the application, explains its main benefit
and helps users begin generating a poem with minimal effort.

It should communicate that the product is a Vietnamese poetry-writing
assistant powered by RAG, rather than a general-purpose chatbot.

**Layout Structure**

Recommended desktop structure:

1.  Global header.

2.  Hero section.

3.  Quick-start input area.

4.  Main-benefit section.

5.  "How it works" preview.

6.  Example generated poem.

7.  Retrieved-context explanation.

8.  Supported poetry forms.

9.  Project or dataset preview.

10. Call-to-action section.

11. Global footer.

Recommended mobile structure:

1.  Compact header.

2.  Hero content.

3.  Opening-verse input.

4.  Main call-to-action.

5.  Benefits in stacked cards.

6.  Example poem.

7.  Short process explanation.

8.  Footer.

**Key Components**

-   Navigation header.

-   Hero title and subtitle.

-   Opening-verse textarea.

-   Poetry-form selector.

-   Primary call-to-action button.

-   Example-prompt chips.

-   Product-benefit cards.

-   Process-step cards.

-   Example poem card.

-   Retrieved-source preview cards.

-   Supported-form chips.

-   Dataset or project information card.

-   Footer.

**Interactive Elements**

Users can:

-   Enter an opening verse.

-   Select a poetry form.

-   Choose an example opening verse.

-   Select "Bắt đầu sáng tác".

-   Navigate to the full generator.

-   Open the "How it works" page.

-   View an example generated poem.

-   View a preview of retrieved reference poems.

-   Navigate to project information.

**Navigation**

**How users arrive**

-   The application root route.

-   Clicking the logo.

-   Clicking "Trang chủ" from navigation.

-   Returning from another page.

**Where users can go**

-   Poetry Generator.

-   How It Works.

-   About the Project.

-   Research Mode, if exposed publicly.

**Recommended route**

/

**Content**

**Hero heading**

Suggested Vietnamese text:

**"Biến một câu thơ thành một bài thơ hoàn chỉnh."**

**Hero subtitle**

Suggested text:

**"Nhập câu thơ mở đầu, chọn thể thơ và phong cách. Hệ thống sẽ tìm
những tác phẩm liên quan để hỗ trợ sáng tác một bài thơ tiếng Việt
mới."**

**Quick-start fields**

-   Label: "Câu thơ mở đầu"

-   Placeholder: "Ví dụ: Trăng nghiêng qua mái hiên nhà\..."

-   Label: "Thể thơ"

-   Placeholder: "Chọn thể thơ"

-   Button: "Bắt đầu sáng tác"

**Example prompts**

-   "Chiều rơi bên mái chùa xưa"

-   "Mưa qua để lại hương đồng"

-   "Em đi qua cuối mùa thu"

-   "Dòng sông giữ bóng quê nhà"

**Benefit cards**

**Card 1**

Title: "Khơi nguồn cảm hứng"

Text: "Phát triển một ý thơ ngắn thành bài thơ hoàn chỉnh."

**Card 2**

Title: "Tôn trọng thể thơ"

Text: "Lựa chọn lục bát, năm chữ, bảy chữ, thơ tự do và nhiều thể thơ
khác."

**Card 3**

Title: "Tham khảo có minh bạch"

Text: "Xem các bài thơ được hệ thống sử dụng làm ngữ cảnh sáng tác."

**Supported poetry forms**

The project materials identify forms such as:

-   Lục bát.

-   Song thất lục bát.

-   Four-syllable poetry.

-   Five-syllable poetry.

-   Six-syllable poetry.

-   Seven-syllable poetry.

-   Eight-syllable poetry.

-   Free verse.

**Dataset preview**

The interface may state that the project uses a Vietnamese poetry corpus
collected from sources including Facebook, Tkaraoke, Thi Viện and Lục
Bát.

**Images and visual elements**

Use:

-   A subtle Vietnamese-literature-inspired decorative illustration.

-   Paper, ink, moon, bamboo or manuscript motifs.

-   A readable poem preview rather than a large stock photograph.

-   Minimal decorative graphics so the page remains academically
    professional.

Avoid:

-   Busy literary collages.

-   Strong historical imagery that implies only classical poetry.

-   Generic robot or chatbot imagery.

**States**

**Default state**

-   Empty opening-verse field.

-   No poetry form selected.

-   Primary button disabled or active with validation on click.

**Partially completed state**

-   Opening verse entered.

-   Poetry form unselected.

-   Field helper reminds user that poetry form is required.

**Validation state**

Messages:

-   "Vui lòng nhập câu thơ mở đầu."

-   "Vui lòng chọn thể thơ."

**Loading state**

When transitioning to the generator:

-   Button changes to "Đang mở không gian sáng tác\..."

-   Prevent duplicate submission.

**Error state**

If initial configuration cannot load:

-   "Không thể tải danh sách thể thơ."

-   Retry button: "Thử lại"

**Responsive state**

On mobile:

-   Hero text becomes shorter.

-   Input fields stack vertically.

-   Decorative images are reduced or hidden.

**3. Page: Poetry Generator**

**Page Name**

**Sáng tác --- Poetry Generator**

**Purpose**

This is the main workspace where users define their poem request,
configure optional preferences and start the RAG generation process.

The required inputs are an opening verse and poetry form. Author style
and literary period are optional.

**Layout Structure**

**Recommended desktop layout**

1.  Global header.

2.  Page-level title bar.

3.  Three-column workspace:

    -   Left: input and configuration panel.

    -   Center: poem preview or generation area.

    -   Right: retrieved-source preview or guidance panel.

4.  Optional sticky action bar.

5.  Global footer, or no footer inside the full workspace.

**Suggested proportions**

-   Left panel: 300--360 px.

-   Main content: flexible.

-   Right panel: 300--360 px.

**Recommended tablet layout**

-   Left configuration panel.

-   Main result area.

-   Sources move below the result.

**Recommended mobile layout**

1.  Page title.

2.  Opening verse.

3.  Required settings.

4.  Optional settings accordion.

5.  Generate button.

6.  Empty result preview.

7.  Source area hidden until generation.

**Key Components**

-   Page heading.

-   Opening-verse textarea.

-   Character counter.

-   Example-input selector.

-   Poetry-form dropdown.

-   Poetry-form information tooltip.

-   Author-style autocomplete field.

-   Literary-period dropdown.

-   Optional filter explanation.

-   Advanced-settings accordion.

-   Top-k stepper or slider.

-   Generation-mode selector.

-   Generate button.

-   Reset button.

-   Input-validation messages.

-   Empty-result panel.

-   Quick-guidance card.

-   Draft-restoration notification.

**Interactive Elements**

Users can:

-   Enter or edit the opening verse.

-   Insert an example verse.

-   Select the poetry form.

-   Search for an author.

-   Select a literary period.

-   Clear optional filters.

-   Expand advanced settings.

-   Set the top-k number of retrieved poems.

-   Switch between Standard Mode and Research Mode.

-   Reset the form.

-   Submit the generation request.

-   Return to a previous draft.

-   View information about poetry forms.

**Navigation**

**How users arrive**

-   "Bắt đầu sáng tác" on the Landing Page.

-   "Sáng tác" in global navigation.

-   "Tạo bài thơ mới" from History.

-   "Chỉnh sửa yêu cầu" from a result.

**Where users can go**

-   Generation Progress.

-   Generation Result.

-   Landing Page.

-   History.

-   Research Mode.

**Recommended route**

/sang-tac

**Content**

**Page title**

**"Sáng tác bài thơ mới"**

**Supporting description**

**"Bắt đầu bằng một câu thơ của bạn, sau đó chọn thể thơ và phong cách
phù hợp."**

**Opening verse section**

Label:

**"Câu thơ mở đầu"**

Required indicator:

**"Bắt buộc"**

Placeholder:

**"Nhập một câu thơ mới mà bạn muốn phát triển\..."**

Helper text:

**"Câu thơ này sẽ được giữ làm điểm khởi đầu cho bài thơ."**

Suggested limit:

-   Soft limit: 150 characters.

-   Warning after 120 characters.

-   Do not block reasonable Vietnamese verse lengths unnecessarily.

**Poetry-form section**

Label:

**"Thể thơ"**

Helper:

**"Hệ thống sẽ cố gắng tuân theo số tiếng, số câu và cách gieo vần của
thể thơ đã chọn."**

Options:

-   Lục bát.

-   Song thất lục bát.

-   Thơ bốn chữ.

-   Thơ năm chữ.

-   Thơ sáu chữ.

-   Thơ bảy chữ.

-   Thơ tám chữ.

-   Thơ tự do.

**Author-style section**

Label:

**"Phong cách tác giả"**

Badge:

**"Không bắt buộc"**

Placeholder:

**"Nhập hoặc tìm tên tác giả"**

Helper:

**"Hệ thống sử dụng thông tin tác giả như một tiêu chí tham khảo phong
cách, không sao chép nguyên văn tác phẩm."**

**Literary-period section**

Label:

**"Thời kỳ sáng tác"**

Options should be based on metadata actually present in the cleaned
dataset.

Possible display options:

-   Không ưu tiên.

-   Trung đại.

-   Cận đại.

-   Hiện đại.

-   Đương đại.

Because the source documents do not define a final normalized list of
literary periods, the implementation team must confirm the exact
available values before finalizing this dropdown.

**Filter-logic explanation**

The project currently specifies OR logic between poetry form, literary
period and author filters.

Suggested interface explanation:

**"Hệ thống có thể tìm các bài thơ phù hợp với ít nhất một tiêu chí đã
chọn."**

Add an information icon with a more detailed tooltip.

**Advanced settings**

Collapsed by default.

Fields:

-   "Số bài thơ tham khảo"

-   "Phương pháp truy xuất"

-   "Mô hình sinh"

-   "Độ sáng tạo"

-   "Độ dài mong muốn"

Only top-k should be visible to general users.

The remaining settings should be limited to Research Mode.

**Buttons**

Primary:

**"Tạo bài thơ"**

Secondary:

**"Đặt lại"**

Optional:

**"Xem ví dụ"**

**Empty-result content**

Heading:

**"Bài thơ của bạn sẽ xuất hiện tại đây."**

Text:

**"Hoàn thành câu thơ mở đầu và chọn thể thơ để bắt đầu."**

**States**

**Empty state**

-   All form controls empty.

-   Generate button disabled.

-   Guidance visible.

**Draft state**

-   One or more fields completed.

-   Unsaved draft indicator.

-   Generate button enabled only when required fields are valid.

**Validation errors**

-   "Vui lòng nhập câu thơ mở đầu."

-   "Câu thơ mở đầu quá dài."

-   "Vui lòng chọn thể thơ."

-   "Không tìm thấy tác giả này. Bạn vẫn có thể sử dụng tên đã nhập."

-   "Giá trị top-k phải nằm trong khoảng cho phép."

**Author autocomplete loading state**

-   Spinner inside field.

-   Text: "Đang tìm tác giả\..."

**Author not found state**

-   Text: "Không tìm thấy tác giả phù hợp."

-   Action: "Sử dụng tên đã nhập"

**Configuration loading state**

-   Skeletons for selectors.

-   Disable generation.

**Draft restoration state**

Message:

**"Đã khôi phục nội dung bạn đang viết."**

**Submission loading state**

-   Generate button becomes loading.

-   Form fields become temporarily read-only.

-   Page transitions to generation progress.

**Backend error state**

Message:

**"Không thể gửi yêu cầu tạo thơ. Vui lòng kiểm tra kết nối và thử
lại."**

Actions:

-   "Thử lại"

-   "Giữ nội dung hiện tại"

**4. Screen: Generation Progress**

**Page Name**

**Đang sáng tác --- Generation Progress**

**Purpose**

This screen communicates that the system is processing the request and
makes the RAG workflow understandable without exposing unnecessary
technical complexity.

It reduces uncertainty while retrieval and generation are running.

**Layout Structure**

1.  Minimal header.

2.  Centered progress card.

3.  Step progress indicator.

4.  User-request summary.

5.  Cancel or return action.

6.  Optional retrieval-preview area.

7.  Minimal footer or no footer.

This may be implemented as:

-   A full page.

-   A modal.

-   A state inside the Poetry Generator page.

A full-page or main-panel state is preferable for longer generation
times.

**Key Components**

-   Animated progress indicator.

-   Four-step progress tracker.

-   Request summary card.

-   Opening-verse preview.

-   Selected poetry-form chip.

-   Optional author and period chips.

-   Cancel button.

-   Technical-details accordion in Research Mode.

-   Loading skeleton for upcoming source cards.

-   Friendly informational messages.

**Interactive Elements**

Users can:

-   View the current generation stage.

-   Expand request details.

-   Cancel generation.

-   Return to edit the request after cancelling.

-   Expand technical progress in Research Mode.

-   Keep the page open until generation completes.

**Navigation**

**How users arrive**

-   Selecting "Tạo bài thơ" from the Generator.

**Where users can go**

-   Automatically to Generation Result.

-   Back to Generator after cancelling.

-   Error Recovery state if generation fails.

**Recommended route**

Either:

/sang-tac/dang-xu-ly

or keep the route as /sang-tac with a loading state.

**Content**

**Main heading**

**"Đang sáng tác bài thơ của bạn"**

**Progress steps**

1.  "Đang phân tích yêu cầu"

2.  "Đang tìm bài thơ liên quan"

3.  "Đang lựa chọn ngữ cảnh"

4.  "Đang sáng tác bài thơ"

**Request summary**

-   Opening verse.

-   Poetry form.

-   Author preference.

-   Literary period.

-   Number of reference poems.

**Informational message**

**"Hệ thống đang tìm những bài thơ phù hợp để làm ngữ cảnh sáng tác. Bài
thơ mới không phải là bản sao của các tác phẩm được tham khảo."**

**Research Mode technical details**

May show:

-   Query preprocessing complete.

-   Retrieval method.

-   Number of candidates.

-   Number of selected contexts.

-   Generation model.

-   Elapsed time.

**States**

**Initial loading state**

First progress step active.

**Retrieval state**

Second step active.

Source skeleton cards may begin appearing.

**Context-selection state**

Third step active.

Display:

**"Đã tìm thấy các bài thơ phù hợp."**

**Generation state**

Fourth step active.

Display:

**"Đang hoàn thiện nhịp điệu và cấu trúc bài thơ."**

**Slow-generation state**

After an extended time:

**"Quá trình đang mất nhiều thời gian hơn dự kiến, nhưng yêu cầu vẫn
đang được xử lý."**

Do not display an inaccurate percentage unless the backend provides real
progress.

**Cancelled state**

**"Đã dừng quá trình sáng tác."**

Buttons:

-   "Chỉnh sửa yêu cầu"

-   "Thử lại"

**Retrieval failure state**

**"Không tìm thấy đủ bài thơ tham khảo phù hợp."**

Options:

-   Generate with fewer contexts.

-   Remove optional filters.

-   Return to editing.

**Generation failure state**

**"Không thể hoàn thành bài thơ."**

Actions:

-   "Thử tạo lại"

-   "Chỉnh sửa yêu cầu"

-   "Quay lại"

**Connection-lost state**

**"Kết nối bị gián đoạn. Hệ thống đang thử kết nối lại."**

**5. Page: Generation Result**

**Page Name**

**Kết quả sáng tác --- Generation Result**

**Purpose**

This page presents the generated poem as the central output and allows
users to inspect, save, copy, refine or regenerate the result.

The result should feel like a finished literary artifact rather than a
chatbot message.

**Layout Structure**

**Desktop**

1.  Global header.

2.  Result toolbar.

3.  Three-column content:

    -   Left: request summary and refinement controls.

    -   Center: generated poem.

    -   Right: retrieved-source panel.

4.  Feedback section.

5.  Related actions.

6.  Optional footer.

**Alternative simplified desktop layout**

1.  Header.

2.  Two-column layout:

    -   Main poem area.

    -   Sources and metadata sidebar.

3.  Refinement bar beneath poem.

**Mobile**

1.  Compact result header.

2.  Generated poem.

3.  Main action buttons.

4.  Request details accordion.

5.  Sources accordion.

6.  Feedback.

7.  Create-new button.

**Key Components**

-   Generated-title field or heading.

-   Poem typography container.

-   Metadata chips.

-   Copy button.

-   Save button.

-   Regenerate button.

-   Edit-request button.

-   Download or export button.

-   Share button, optional.

-   Feedback controls.

-   Structure-analysis summary.

-   Retrieved-sources panel.

-   Version selector.

-   Refine-poem input.

-   Confirmation toast.

-   Unsaved-result indicator.

**Interactive Elements**

Users can:

-   Read the complete poem.

-   Copy the poem.

-   Save the poem.

-   Regenerate with the same settings.

-   Edit the original request.

-   Create a refined version.

-   Change only selected constraints.

-   Open source details.

-   View structure analysis.

-   Provide positive or negative feedback.

-   Switch between generated versions.

-   Delete a version.

-   Export the poem as text or image, if implemented.

-   Start a new poem.

**Navigation**

**How users arrive**

-   Automatically after successful generation.

-   From Generation History.

-   By opening a saved result.

-   After regenerating a previous poem.

**Where users can go**

-   Back to Generator with current values.

-   Retrieved Source Detail.

-   History.

-   Landing Page.

-   New generation flow.

**Recommended route**

/ket-qua/:generationId

For an account-free MVP, generationId may reference local state or local
storage.

**Content**

**Result heading**

**"Bài thơ được tạo"**

**Generated poem content**

Display:

-   Generated title.

-   Opening verse.

-   Remaining poem lines.

-   Clear line breaks.

-   Comfortable serif typography.

-   Poetry-form label.

**Metadata**

-   "Thể thơ: Lục bát"

-   "Phong cách tác giả: Không chọn"

-   "Thời kỳ: Hiện đại"

-   "Số bài thơ tham khảo: 5"

-   Generation date and time.

**Main actions**

-   "Sao chép"

-   "Lưu bài thơ"

-   "Tạo phiên bản khác"

-   "Chỉnh sửa yêu cầu"

-   "Bắt đầu bài thơ mới"

**Refine section**

Heading:

**"Điều chỉnh bài thơ"**

Suggested quick refinements:

-   "Giàu cảm xúc hơn"

-   "Ngôn ngữ cổ điển hơn"

-   "Ngắn gọn hơn"

-   "Gieo vần rõ hơn"

-   "Giữ sát câu mở đầu hơn"

-   "Dùng nguồn tham khảo khác"

Free-text field:

**"Mô tả điều bạn muốn thay đổi\..."**

Button:

**"Tạo phiên bản chỉnh sửa"**

**Structure-analysis section**

Possible content:

-   Poetry-form compliance.

-   Line count.

-   Approximate syllable count.

-   Rhyme consistency.

-   Continuity.

-   Context relevance.

The source materials mention evaluation concepts including response
accuracy, response continuity, response relevance, context information
volume, context match score, poetic structure, lexical richness and
sentiment trajectory.

For normal users, present only simple explanations.

For Research Mode, show detailed scores.

**Feedback section**

Question:

**"Bạn thấy bài thơ này như thế nào?"**

Options:

-   "Phù hợp với yêu cầu"

-   "Cấu trúc tốt"

-   "Cảm xúc tự nhiên"

-   "Chưa đúng thể thơ"

-   "Chưa liên quan"

-   "Ngôn ngữ chưa tự nhiên"

Optional comment field.

**States**

**Success state**

Complete poem and sources available.

**Partial success state**

Poem generated but sources unavailable.

Message:

**"Bài thơ đã được tạo, nhưng thông tin nguồn tham khảo chưa thể hiển
thị."**

**Unsaved state**

Badge:

**"Chưa lưu"**

**Saved state**

Toast:

**"Đã lưu bài thơ vào lịch sử."**

Button changes to:

**"Đã lưu"**

**Copy-success state**

Toast:

**"Đã sao chép bài thơ."**

**Regeneration loading state**

Keep current poem visible while new version is generated.

Display:

**"Đang tạo phiên bản mới\..."**

**Empty-result state**

Should be rare.

Message:

**"Không có nội dung bài thơ để hiển thị."**

Action:

-   "Quay lại trang sáng tác"

**Formatting warning state**

If the result does not follow the requested form:

**"Bài thơ có thể chưa hoàn toàn tuân theo cấu trúc của thể thơ đã
chọn."**

**Save error state**

**"Không thể lưu bài thơ."**

For local storage:

**"Bộ nhớ trình duyệt không khả dụng hoặc đã đầy."**

**Export error state**

**"Không thể tạo tệp xuất. Vui lòng thử lại."**

**6. Page or Panel: Retrieved Sources**

**Page Name**

**Bài thơ tham khảo --- Retrieved Sources**

**Purpose**

This page or panel displays the top-k poems retrieved by the RAG system
and explains how each source relates to the user\'s request.

It provides transparency and demonstrates the retrieval component of the
academic project.

The project specifically requires users to configure top-k and view the
documents used as generation context.

**Layout Structure**

**Desktop panel**

1.  Panel header.

2.  Retrieval summary.

3.  Filter-match summary.

4.  Sort and view controls.

5.  Scrollable source-card list.

6.  Technical details accordion.

7.  Close or collapse control.

**Full-page version**

1.  Global header.

2.  Page title.

3.  Query summary.

4.  Retrieval statistics.

5.  Source list.

6.  Pagination or load-more.

7.  Footer.

**Mobile**

-   Bottom sheet.

-   Accordion.

-   Full-screen drawer.

**Key Components**

-   Source-panel header.

-   Top-k indicator.

-   Retrieval-method badge.

-   Source cards.

-   Match-reason tags.

-   Relevance indicator.

-   Rank number.

-   Poem excerpt.

-   Author and period metadata.

-   View-detail button.

-   Sort control.

-   Filter control.

-   Technical-details accordion.

-   Empty-state illustration.

-   Retry button.

**Interactive Elements**

Users can:

-   Open or close the panel.

-   Scroll through retrieved poems.

-   Open a source-detail view.

-   Sort sources by rank, relevance or metadata.

-   Filter sources by match reason.

-   Expand excerpts.

-   View technical retrieval details.

-   Copy a source title.

-   Increase or decrease top-k and regenerate.

-   Compare retrieved results in Research Mode.

**Navigation**

**How users arrive**

-   From Generation Result.

-   From Generation Progress when sources become available.

-   From Research Mode.

-   From a source count link such as "5 bài thơ tham khảo".

**Where users can go**

-   Source Detail.

-   Generation Result.

-   Research Mode.

-   Generator settings.

**Recommended implementation**

Prefer a right-side panel instead of a standalone page for the MVP.

Possible route for full page:

/ket-qua/:generationId/nguon-tham-khao

**Content**

**Panel heading**

**"Các bài thơ tham khảo"**

**Summary text**

**"Hệ thống đã sử dụng 5 bài thơ làm ngữ cảnh để hỗ trợ quá trình sáng
tác."**

**Source card fields**

Each card should include:

-   Retrieval rank.

-   Poem title.

-   Author.

-   Poetry form.

-   Literary period.

-   Short excerpt.

-   Match-reason tags.

-   Similarity score in Research Mode.

-   "Xem chi tiết" button.

**Example match tags**

-   "Cùng thể thơ"

-   "Cùng tác giả"

-   "Cùng thời kỳ"

-   "Nội dung tương đồng"

-   "Hình ảnh thơ tương đồng"

**OR-filter explanation**

Because the current retrieval-filter design uses OR logic, a source may
be included when it matches one or more selected criteria.

Suggested text:

**"Một bài thơ có thể được chọn khi phù hợp với ít nhất một tiêu chí:
thể thơ, tác giả hoặc thời kỳ sáng tác."**

**Research Mode fields**

-   Retrieval score.

-   Dense score.

-   BM25 score.

-   Hybrid score.

-   Retrieval method.

-   Document ID.

-   Applied metadata filters.

-   Rank before and after reranking.

Only include fields that the backend actually produces.

**States**

**Loading state**

-   Skeleton source cards.

-   "Đang tải các bài thơ tham khảo\..."

**Success state**

-   Full list of source cards.

**Empty state**

Message:

**"Không tìm thấy bài thơ tham khảo phù hợp."**

Suggestions:

-   Remove the author preference.

-   Remove the period preference.

-   Increase top-k.

-   Use a different opening verse.

**Partial metadata state**

A source may lack author or period information.

Display:

-   "Chưa rõ tác giả"

-   "Chưa xác định thời kỳ"

Do not hide the entire source card.

**Retrieval-error state**

**"Không thể tải danh sách bài thơ tham khảo."**

Actions:

-   "Thử lại"

-   "Xem bài thơ đã tạo"

**Low-relevance state**

Warning:

**"Một số nguồn có mức độ liên quan thấp do yêu cầu quá cụ thể."**

**Long-excerpt state**

Clamp excerpt to several lines with:

-   "Xem thêm"

-   "Thu gọn"

**7. Screen: Source Detail**

**Page Name**

**Chi tiết bài thơ tham khảo --- Source Detail**

**Purpose**

This screen provides expanded information about one retrieved poem and
explains why it was selected as RAG context.

It supports transparency, educational exploration and technical
demonstration.

**Layout Structure**

Recommended desktop drawer:

1.  Drawer header.

2.  Source metadata.

3.  Match-reason section.

4.  Poem excerpt or available full text.

5.  Retrieval explanation.

6.  Technical information in Research Mode.

7.  Footer actions.

Recommended mobile:

-   Full-screen modal.

-   Sticky close button.

-   Scrollable content.

**Key Components**

-   Close button.

-   Poem title.

-   Author profile label.

-   Poetry-form badge.

-   Literary-period badge.

-   Source-origin label.

-   Poem text container.

-   Match-reason list.

-   Relevance indicator.

-   Retrieval-rank display.

-   Technical-data table.

-   Previous/next source controls.

-   Copy citation or metadata button.

-   Disclaimer.

**Interactive Elements**

Users can:

-   Read the available poem text.

-   Expand or collapse long text.

-   View metadata.

-   See why the poem matched.

-   Move to previous or next source.

-   Copy source information.

-   Return to the generated poem.

-   Open technical retrieval data.

-   Report incorrect metadata, optional.

**Navigation**

**How users arrive**

-   Selecting "Xem chi tiết" from a source card.

-   Selecting a source title from Research Mode.

**Where users can go**

-   Back to Retrieved Sources.

-   Back to Generation Result.

-   Previous or next source.

**Recommended route**

For a drawer, keep the current route.

For a full page:

/nguon-tham-khao/:poemId

**Content**

**Header fields**

-   Poem title.

-   Author.

-   Poetry form.

-   Literary period.

-   Dataset source.

**Match explanation**

Example:

**"Bài thơ này được chọn vì có nội dung gần với câu mở đầu và cùng thuộc
thể lục bát."**

**Poem text**

Use only the text available in the project dataset.

The current documents do not define licensing or display restrictions
for full poems. The team should verify whether the complete poem can be
shown publicly. Until confirmed, the safer UI choice is to display an
excerpt rather than automatically showing the full work.

**Retrieval technical data**

Research Mode only:

-   Poem ID.

-   Retrieval rank.

-   Similarity score.

-   BM25 score.

-   Embedding score.

-   Hybrid score.

-   Matched metadata.

-   Retrieval method.

**Disclaimer**

**"Tác phẩm này được sử dụng làm ngữ cảnh tham khảo cho hệ thống. Bài
thơ được tạo không nên sao chép nguyên văn nội dung nguồn."**

**States**

**Loading state**

-   Skeleton title.

-   Skeleton metadata.

-   Skeleton text lines.

**Success state**

All available data shown.

**Missing-text state**

**"Không có toàn văn cho bài thơ này."**

Display available metadata and excerpt.

**Missing-metadata state**

Use neutral labels:

-   "Chưa xác định"

-   "Không có dữ liệu"

**Error state**

**"Không thể tải thông tin bài thơ."**

Actions:

-   "Thử lại"

-   "Đóng"

**Source removed state**

If a historical generation references a document no longer available:

**"Nguồn tham khảo này hiện không còn khả dụng."**

**Long-content state**

Provide:

-   Table-of-content not required.

-   Scroll position indicator optional.

-   Sticky close action.

**8. Page: Generation History**

**Page Name**

**Lịch sử sáng tác --- Generation History**

**Purpose**

The History Page lets users revisit previously generated poems, continue
editing them, compare versions and remove results they no longer need.

For the MVP, history may be stored locally in the browser without
requiring authentication.

**Layout Structure**

**Desktop**

1.  Global header.

2.  Page title and description.

3.  Search and filter toolbar.

4.  Optional left filter sidebar.

5.  Main list or grid of history cards.

6.  Pagination or load-more.

7.  Footer.

**Mobile**

1.  Compact header.

2.  Search field.

3.  Filter button.

4.  Stacked history cards.

5.  Floating "Tạo bài thơ mới" button.

**Key Components**

-   Search input.

-   Sort selector.

-   Poetry-form filter.

-   Date filter.

-   Saved-only filter.

-   Grid/list toggle.

-   History cards.

-   Version badges.

-   Favorite or save icon.

-   Open button.

-   Duplicate button.

-   Delete button.

-   Delete-confirmation dialog.

-   Clear-history action.

-   Empty-state illustration.

-   Local-storage notice.

**Interactive Elements**

Users can:

-   Search by title or opening verse.

-   Filter by poetry form.

-   Filter by author preference or period.

-   Sort by newest, oldest or title.

-   Open a result.

-   Duplicate the original request.

-   Generate a new version.

-   Delete a single result.

-   Clear all history.

-   Mark a poem as saved or favorite.

-   Export a saved poem, optional.

-   Switch between list and grid view.

**Navigation**

**How users arrive**

-   Global navigation.

-   Selecting "Xem lịch sử" after saving a poem.

-   Returning from a historical result.

**Where users can go**

-   Generation Result.

-   Poetry Generator.

-   Landing Page.

**Recommended route**

/lich-su

**Content**

**Heading**

**"Lịch sử sáng tác"**

**Supporting text**

**"Xem lại, chỉnh sửa hoặc tạo phiên bản mới từ những bài thơ trước
đây."**

**History card fields**

-   Generated title.

-   Opening verse.

-   Poetry form.

-   Author preference.

-   Literary period.

-   Date generated.

-   Short poem excerpt.

-   Number of versions.

-   Saved status.

-   Source count.

**Card actions**

-   "Mở"

-   "Tạo phiên bản khác"

-   "Dùng lại yêu cầu"

-   "Xóa"

**Storage notice**

For local-only MVP:

**"Lịch sử được lưu trên trình duyệt hiện tại và có thể bị mất khi dữ
liệu trình duyệt bị xóa."**

**States**

**Loading state**

If history is server-backed:

-   Skeleton history cards.

For local storage, loading should be nearly immediate.

**Empty state**

Heading:

**"Bạn chưa có bài thơ nào."**

Text:

**"Hãy bắt đầu bằng một câu thơ của riêng bạn."**

Button:

**"Tạo bài thơ đầu tiên"**

**Search-no-result state**

**"Không tìm thấy bài thơ phù hợp với từ khóa."**

Action:

-   Clear search.

**Filter-no-result state**

**"Không có bài thơ nào phù hợp với bộ lọc hiện tại."**

Action:

-   "Xóa bộ lọc"

**Delete-confirmation state**

Dialog:

**"Bạn có chắc muốn xóa bài thơ này?"**

Buttons:

-   "Hủy"

-   "Xóa"

**Clear-history confirmation state**

Strong confirmation:

**"Thao tác này sẽ xóa toàn bộ lịch sử trên trình duyệt và không thể
hoàn tác."**

**Storage error state**

**"Không thể truy cập bộ nhớ trình duyệt."**

**Corrupted-record state**

**"Một mục lịch sử không thể được tải đầy đủ."**

Allow deletion or recovery.

**9. Page: How It Works**

**Page Name**

**Cách hoạt động --- How It Works**

**Purpose**

This page explains the RAG workflow in clear language so users
understand how the system retrieves poetry and generates a new result.

It should support both general understanding and academic demonstration.

**Layout Structure**

1.  Global header.

2.  Page introduction.

3.  Visual RAG pipeline.

4.  Detailed process sections.

5.  Example request walkthrough.

6.  Retrieval explanation.

7.  Generation explanation.

8.  Source-transparency explanation.

9.  Limitations and responsible-use section.

10. Call to action.

11. Footer.

**Key Components**

-   Page hero.

-   Pipeline diagram.

-   Numbered step cards.

-   Before-and-after example.

-   Query card.

-   Retrieved-source cards.

-   Prompt-construction illustration.

-   Generated-poem card.

-   Expandable technical explanations.

-   FAQ accordion.

-   Call-to-action button.

**Interactive Elements**

Users can:

-   Step through the RAG pipeline.

-   Expand technical details.

-   View an example query.

-   View example retrieved sources.

-   Compare user input with generated output.

-   Read common questions.

-   Navigate to the Generator.

-   Switch between simple and technical explanations.

**Navigation**

**How users arrive**

-   Global navigation.

-   Landing Page process preview.

-   Result Page source explanation.

-   About Project page.

**Where users can go**

-   Generator.

-   About Project.

-   Research Mode.

-   Landing Page.

**Recommended route**

/cach-hoat-dong

**Content**

**Main heading**

**"Hệ thống tạo thơ như thế nào?"**

**Introduction**

**"Ứng dụng không chỉ gửi yêu cầu trực tiếp đến mô hình ngôn ngữ. Trước
tiên, hệ thống tìm các bài thơ liên quan trong kho dữ liệu và sử dụng
chúng làm ngữ cảnh sáng tác."**

**Pipeline steps**

**Step 1: User input**

**"Bạn nhập một câu thơ mở đầu và chọn các yêu cầu như thể thơ, tác giả
hoặc thời kỳ."**

**Step 2: Query processing**

**"Hệ thống phân tích nội dung và chuẩn hóa các tiêu chí tìm kiếm."**

**Step 3: Retrieval**

**"Hệ thống tìm các bài thơ phù hợp bằng truy xuất từ khóa, vector hoặc
phương pháp kết hợp."**

The project materials identify BM25, embedding retrieval, hybrid
retrieval and HyDE as retrieval approaches to benchmark.

**Step 4: Context selection**

**"Các bài thơ phù hợp nhất được chọn làm ngữ cảnh."**

**Step 5: Generation**

**"Mô hình kết hợp yêu cầu của bạn với ngữ cảnh để tạo bài thơ mới."**

**Step 6: Result and transparency**

**"Bạn nhận được bài thơ cùng danh sách các tác phẩm được tham khảo."**

**Retrieval explanation**

Explain:

-   Keyword matching.

-   Semantic similarity.

-   Metadata filters.

-   Hybrid search.

Keep examples visual.

**Academic metrics section**

Research-oriented explanation may mention:

-   Recall.

-   Gold Coverage.

-   MRR.

-   MAP.

-   nDCG.

-   Response continuity.

-   Response relevance.

-   Context match.

-   Poetic structure.

These metrics are listed in the team materials for retrieval and
generation evaluation.

**Limitations**

Suggested content:

-   Generated poems may not perfectly follow all poetic rules.

-   Author-style imitation is approximate.

-   Retrieved sources may not always be equally relevant.

-   Dataset metadata may contain missing or inconsistent values.

-   Generated content should be reviewed by the user.

-   The system should not claim that the output was written by a real
    poet.

**CTA**

**"Thử sáng tác một bài thơ"**

**States**

**Default state**

All educational content available.

**Diagram-loading state**

If diagrams are dynamically rendered:

-   Static fallback image or simplified flow.

**Video or animation failure state**

Use static illustrations.

**Example-data error state**

**"Không thể tải ví dụ minh họa."**

The explanatory text should remain accessible.

**Mobile state**

Convert horizontal pipeline into a vertical timeline.

**10. Page: About the Project**

**Page Name**

**Về dự án --- About the Project**

**Purpose**

This page presents the project\'s academic objective, team, dataset,
architecture, technology stack, methodology and acknowledgements.

It establishes trust and documents the project context.

**Layout Structure**

1.  Global header.

2.  Project overview hero.

3.  Problem statement.

4.  Project objectives.

5.  Dataset overview.

6.  System architecture.

7.  Retrieval methods.

8.  Generation methods.

9.  Evaluation approach.

10. Technology stack.

11. Team section.

12. References and acknowledgements.

13. Footer.

**Key Components**

-   Project summary card.

-   Objective list.

-   Dataset-statistics cards.

-   Dataset-source chart.

-   System-architecture diagram.

-   Technology badges.

-   Method cards.

-   Team-member cards.

-   Timeline or milestone list.

-   Academic-reference list.

-   Repository link, if public.

-   Contact or feedback information.

**Interactive Elements**

Users can:

-   Expand technical sections.

-   View dataset statistics.

-   Open architecture details.

-   View team-member roles.

-   Open references.

-   Navigate to Research Mode.

-   Navigate to the Generator.

-   Visit a public repository, if available.

**Navigation**

**How users arrive**

-   Global navigation.

-   Landing Page.

-   How It Works.

-   Footer links.

**Where users can go**

-   Generator.

-   How It Works.

-   Research Mode.

-   External academic references.

**Recommended route**

/ve-du-an

**Content**

**Project overview**

Suggested heading:

**"Dự án sinh thơ tiếng Việt bằng RAG"**

Suggested text:

**"Dự án nghiên cứu khả năng kết hợp truy xuất thông tin và mô hình ngôn
ngữ để hỗ trợ sáng tác thơ tiếng Việt có định hướng về thể thơ, tác giả
và thời kỳ."**

**Dataset statistics**

The selected corpus is described as containing poems from:

-   Facebook: 85,378 poems.

-   Tkaraoke: 65,697 poems.

-   Thi Viện: 36,875 poems.

-   Lục Bát: 10,648 poems.

The source notes also state an average of approximately 139.6 words and
24.5 lines per poem.

**Dataset note**

Clarify that exact statistics and metadata availability should be
validated against the final processed dataset before publication.

**Retrieval methods**

-   BM25.

-   Embedding-based retrieval.

-   Hybrid retrieval.

-   HyDE.

-   Metadata filtering.

-   Vector database.

The documents reference both FAISS and ChromaDB at different planning
stages.\
The final About page should display only the database actually used in
the completed system.

**Generation models**

The project notes mention several potential model groups and models,
including:

-   Gemini 2.5 Flash.

-   BARTpho.

-   mT5.

-   SP-GPT2.

-   PhoBERT-related components.

-   XLM-R-related components.

The final page should clearly separate:

-   Models considered.

-   Models benchmarked.

-   Model selected for deployment.

**Technology stack**

-   Figma.

-   ReactJS.

-   TypeScript.

-   Tailwind CSS.

-   Shadcn/ui.

-   FastAPI.

-   LangChain.

-   ChromaDB or FAISS.

-   Vercel for optional frontend deployment.

-   Docker for optional backend packaging.

**Evaluation section**

Retrieval metrics:

-   Recall.

-   Gold Coverage.

-   MRR.

-   MAP.

-   nDCG at top 1, 5 and 10.

Generation metrics:

-   Response Accuracy.

-   Response Continuity.

-   Response Relevance.

-   Context Information Volume.

-   Context Match Score.

-   Poetic Structure Evaluation Score.

-   Lexical Richness.

-   Sentiment Trajectory Change Ratio.

-   BLEU.

-   ROUGE.

**Team section**

Display:

-   Member name.

-   Role.

-   Assigned project area.

-   Optional avatar or initials.

Only include information the team agrees to publish.

**Images and diagrams**

Use:

-   Architecture diagram.

-   Retrieval pipeline.

-   Dataset distribution chart.

-   Technology badges.

-   Team avatars or initials.

-   Example corpus preview.

**States**

**Loading state**

Needed only if data is loaded dynamically.

**Missing statistics state**

Use:

**"Số liệu đang được cập nhật theo phiên bản dữ liệu cuối cùng."**

**Missing team-role state**

Display member without an assigned public role.

**External-link failure**

External references should open safely in a new tab.

**Mobile state**

Convert architecture diagrams into vertically scrollable cards.

**11. Page: Research Mode**

**Page Name**

**Chế độ nghiên cứu --- Research Mode**

**Purpose**

Research Mode provides technical controls and diagnostic information for
team members, instructors and evaluators.

It allows retrieval methods, models and parameters to be inspected or
compared without cluttering the general creative interface.

**Layout Structure**

**Desktop dashboard**

1.  Global header with Research Mode badge.

2.  Research-session toolbar.

3.  Left configuration sidebar.

4.  Main experiment area.

5.  Right metrics and logs panel.

6.  Bottom comparison table or context list.

Alternative structure:

-   Tabbed dashboard:

    -   Query.

    -   Retrieval.

    -   Generation.

    -   Metrics.

    -   Comparison.

**Key Components**

-   Query input.

-   Poetry-form selector.

-   Author and period filters.

-   Retrieval-method selector.

-   Embedding-model selector.

-   Vector-database selector, if configurable.

-   Top-k control.

-   Reranking control.

-   Generation-model selector.

-   Temperature control.

-   Prompt preview.

-   Run-experiment button.

-   Retrieved-result table.

-   Source-detail drawer.

-   Generated-poem panel.

-   Retrieval-score table.

-   Generation-metric cards.

-   Comparison charts.

-   Raw JSON viewer.

-   Export-results button.

-   Experiment-history list.

-   Error-log panel.

**Interactive Elements**

Users can:

-   Enter a benchmark or custom query.

-   Select BM25, dense, hybrid or HyDE retrieval.

-   Select an embedding model.

-   Change top-k.

-   Apply author, period or poetry-form filters.

-   Select a generation model.

-   View the constructed prompt.

-   Run retrieval only.

-   Run generation only.

-   Run the complete pipeline.

-   Compare retrieval methods.

-   Compare generated poems.

-   View metric results.

-   Export experiment data.

-   Copy raw API responses.

-   Open document details.

-   Save experiment configurations.

-   Repeat a previous experiment.

**Navigation**

**How users arrive**

-   Global navigation, if public.

-   About Project.

-   How It Works.

-   Advanced settings in the Generator.

-   Direct internal route.

**Where users can go**

-   Standard Generator.

-   Source Detail.

-   About Project.

-   Experiment Result detail.

**Recommended route**

/nghien-cuu

Consider restricting this route to internal or demonstration use.

**Content**

**Page heading**

**"Chế độ nghiên cứu"**

**Warning banner**

**"Các thiết lập trong trang này dành cho thử nghiệm kỹ thuật và có thể
làm thay đổi đáng kể kết quả truy xuất hoặc sinh thơ."**

**Retrieval configuration**

Fields:

-   Retrieval method.

-   Embedding model.

-   Top-k.

-   Search index.

-   Metadata filters.

-   Hybrid weights.

-   HyDE prompt.

-   Reranking option.

**Models mentioned in project planning**

Embedding candidates include:

-   multilingual-e5-large-instruct.

-   PhoBERT-based embedding approaches.

-   paraphrase-multilingual-MiniLM-L12-v2.

-   Additional LangChain-compatible embedding models.\
    Only models successfully integrated should appear as selectable
    options.

**Retrieval-result table**

Columns:

-   Rank.

-   Poem ID.

-   Title.

-   Author.

-   Period.

-   Poetry form.

-   Dense score.

-   BM25 score.

-   Hybrid score.

-   Gold relevance, for benchmark datasets.

-   View source.

**Benchmark metrics**

-   Recall@1, \@5 and \@10.

-   Gold Coverage@1, \@5 and \@10.

-   MRR.

-   MAP.

-   nDCG@1, \@5 and \@10.

**Generation configuration**

Fields:

-   Generation model.

-   Prompt template.

-   Retrieved context.

-   Temperature.

-   Maximum tokens.

-   Poetry-rule prompt.

-   Number of variants.

**Generation metrics**

-   RA.

-   RC.

-   RR.

-   CIV\.

-   CMS.

-   PSES.

-   LR.

-   STCR.

-   BLEU.

-   ROUGE.

Clearly explain whether each metric is:

-   Automatically computed.

-   LLM-evaluated.

-   Human-evaluated.

-   Experimental.

**Experiment export**

Possible formats:

-   CSV.

-   JSON.

-   Markdown report.

**States**

**Initial state**

No experiment has run.

Show:

**"Thiết lập cấu hình và chạy thử nghiệm đầu tiên."**

**Configuration loading state**

Selectors display skeletons.

**Retrieval-running state**

Progress indicator and partial results.

**Generation-running state**

Generated-poem panel shows skeleton.

**Complete state**

Metrics, contexts and generated poem displayed.

**No-result state**

**"Không tìm thấy tài liệu phù hợp với cấu hình hiện tại."**

**Invalid-configuration state**

Examples:

-   Top-k exceeds index size.

-   Model unavailable.

-   Hybrid weights invalid.

-   Required query missing.

**Model unavailable state**

**"Mô hình đã chọn hiện không khả dụng."**

**Metric unavailable state**

**"Metric này chưa được triển khai cho cấu hình hiện tại."**

**Partial benchmark state**

Display available metrics and clearly mark missing values.

**API error state**

Show:

-   Friendly summary.

-   Technical details accordion.

-   Retry action.

-   Copy-error button.

**Export error state**

**"Không thể xuất kết quả thử nghiệm."**

**Large-result state**

Use:

-   Pagination.

-   Virtualized table.

-   Sticky column headers.

**12. Supporting Modal: Save Poem**

**Page Name**

**Lưu bài thơ --- Save Poem Modal**

**Purpose**

Allows users to name and save a generated poem to local or account-based
history.

**Layout Structure**

1.  Modal header.

2.  Title input.

3.  Poem preview.

4.  Save-location information.

5.  Footer buttons.

**Key Components**

-   Title input.

-   Optional note field.

-   Poem preview.

-   Save button.

-   Cancel button.

-   Storage notice.

**Interactive Elements**

Users can:

-   Edit the generated title.

-   Add an optional note.

-   Save.

-   Cancel.

**Navigation**

Opened from Generation Result.

Closes back to Generation Result.

**Content**

-   "Lưu bài thơ"

-   "Tên bài thơ"

-   "Ghi chú"

-   "Lưu vào lịch sử"

-   "Hủy"

**States**

-   Default.

-   Saving.

-   Saved.

-   Duplicate-name warning.

-   Storage error.

**13. Supporting Modal: Delete Confirmation**

**Page Name**

**Xác nhận xóa --- Delete Confirmation**

**Purpose**

Prevents accidental deletion of a generated poem or history record.

**Layout Structure**

1.  Warning icon.

2.  Confirmation message.

3.  Item name.

4.  Cancel and delete actions.

**Key Components**

-   Warning message.

-   Cancel button.

-   Destructive delete button.

**Interactive Elements**

Users can:

-   Cancel.

-   Confirm deletion.

**Navigation**

Opened from History or Result.

Returns to the originating page.

**Content**

**"Bạn có chắc muốn xóa bài thơ này? Thao tác này không thể hoàn tác."**

**States**

-   Default.

-   Deleting.

-   Delete success.

-   Delete failure.

**14. Supporting Screen: Error Recovery**

**Page Name**

**Không thể hoàn thành yêu cầu --- Error Recovery**

**Purpose**

Provides clear recovery options when the generator, retrieval system or
backend fails.

**Layout Structure**

1.  Minimal header.

2.  Error illustration.

3.  Error heading.

4.  Plain-language explanation.

5.  Recovery actions.

6.  Technical details accordion.

**Key Components**

-   Error icon.

-   Error title.

-   Error message.

-   Retry button.

-   Edit-request button.

-   Return-home button.

-   Technical-details accordion.

**Interactive Elements**

Users can:

-   Retry.

-   Return to the Generator.

-   Edit the request.

-   Copy technical error details.

-   Return home.

**Navigation**

Appears after unrecoverable generation or retrieval errors.

**Content**

Suggested generic message:

**"Hệ thống chưa thể hoàn thành yêu cầu của bạn."**

Suggested supporting text:

**"Nội dung đã nhập vẫn được giữ lại. Bạn có thể thử lại hoặc điều chỉnh
yêu cầu."**

**States**

-   Retrieval error.

-   Generation error.

-   Connection error.

-   Server error.

-   Session-expired error.

-   Unknown error.

**15. Recommended Route Map**

/

├── /sang-tac

├── /sang-tac/dang-xu-ly

├── /ket-qua/:generationId

├── /ket-qua/:generationId/nguon-tham-khao

├── /nguon-tham-khao/:poemId

├── /lich-su

├── /cach-hoat-dong

├── /ve-du-an

└── /nghien-cuu

For the MVP, the route structure can be simplified:

/

├── /sang-tac

├── /ket-qua/:generationId

├── /lich-su

├── /cach-hoat-dong

└── /ve-du-an

The Retrieved Sources and Source Detail experiences can be implemented
as panels or drawers rather than separate routes.

**16. Recommended MVP Screen Priority**

**Priority 1: Essential**

1.  Landing Page.

2.  Poetry Generator.

3.  Generation Progress state.

4.  Generation Result.

5.  Retrieved Sources panel.

6.  Source Detail drawer.

7.  Error Recovery states.

**Priority 2: Strongly Recommended**

1.  Generation History.

2.  How It Works.

3.  About the Project.

4.  Save and delete modals.

**Priority 3: Academic Demonstration**

1.  Research Mode.

2.  Metric comparison.

3.  Experiment export.

4.  Model and retrieval benchmarking.

**17. Figma Frame Checklist**

For each main page, design at least:

-   Desktop default state.

-   Desktop loading state.

-   Desktop error state.

-   Mobile default state.

-   Mobile completed state.

Minimum recommended Figma frames:

1.  Landing --- Desktop.

2.  Landing --- Mobile.

3.  Generator --- Empty.

4.  Generator --- Completed input.

5.  Generator --- Validation error.

6.  Generation --- Retrieval loading.

7.  Generation --- Model loading.

8.  Result --- Success.

9.  Result --- Partial success.

10. Result --- Mobile.

11. Retrieved Sources --- Open.

12. Source Detail --- Open.

13. History --- Populated.

14. History --- Empty.

15. How It Works.

16. About Project.

17. Research Mode --- Initial.

18. Research Mode --- Completed experiment.

19. Generic backend error.

20. Save confirmation.

21. Delete confirmation.

**18. Final UX Direction**

The application should feel primarily like a calm Vietnamese
creative-writing environment.

The interface should emphasize:

-   The user\'s opening verse.

-   The generated poem.

-   Vietnamese literary character.

-   Ease of use.

-   Transparent references.

-   Clear required and optional settings.

Technical implementation details should remain secondary and should
appear through:

-   "Cài đặt nâng cao"

-   "Chi tiết truy xuất"

-   "Chế độ nghiên cứu"

This separation allows normal users to focus on creativity while still
giving project evaluators access to the RAG system, benchmark settings
and detailed metrics.

**DESIGN SYSTEM:**

**Vietnamese RAG Poetry Generator**

**Visual Design Guide**

**1. Design Direction**

**1.1 Brand Personality**

The application should feel:

-   Literary.

-   Calm.

-   Thoughtful.

-   Creative.

-   Trustworthy.

-   Modern but culturally appropriate.

-   Technical only when the user opens Research Mode.

The interface should resemble a digital poetry-writing space rather than
a chatbot or analytics dashboard.

**1.2 Visual Concept**

The recommended visual concept combines:

-   Warm paper-like backgrounds.

-   Deep ink-inspired primary colors.

-   Muted literary accent colors.

-   Generous whitespace.

-   Serif typography for poetry.

-   Sans-serif typography for interface controls.

-   Thin borders and subtle shadows.

-   Minimal decorative elements inspired by Vietnamese literature.

Possible visual references include:

-   Traditional ink.

-   Old Vietnamese manuscripts.

-   Rice paper.

-   Moonlight.

-   Bamboo.

-   Lotus leaves.

-   Book margins.

-   Handwritten poetry notebooks.

These references should appear subtly. The interface should not look
historical, ornamental, or visually crowded.

**1.3 Design Principles**

**Poetry First**

The generated poem should always be the strongest visual element on the
result page.

**Calm Interaction**

Avoid unnecessary motion, strong gradients, flashing effects, and
oversized visual decorations.

**Clear Hierarchy**

Required inputs, optional inputs, generated content, and retrieved
references must be visually distinguishable.

**Literary but Usable**

Serif fonts can create a literary atmosphere, but they should mainly be
used for poem content, quotations, and selected display headings.

**Transparent AI**

Retrieved poems and source information should be visible without
overwhelming the primary creative experience.

**Vietnamese-First Interface**

All interface labels, instructions, validation messages, buttons, and
system feedback should use Vietnamese.

**2. Color Palette**

**2.1 Core Brand Colors**

**Primary Color --- Ink Indigo**

**Primary 600: #3F4A6B**

Ink Indigo is the main brand color. It communicates intelligence,
literature, trust, and quiet creativity.

Recommended uses:

-   Primary buttons.

-   Active navigation items.

-   Selected form controls.

-   Important links.

-   Focus indicators.

-   Key icons.

-   Research Mode highlights.

Supporting primary shades:

  -----------------------------------------------------------------------
  **Token**       **Hex**     **Recommended use**
  --------------- ----------- -------------------------------------------
  Primary 50      #F2F4F8     Very light selected backgrounds

  Primary 100     #E4E7EF     Hover surfaces and subtle highlights

  Primary 200     #C9CFDF     Borders and disabled selections

  Primary 300     #A5AEC7     Secondary icons

  Primary 400     #7C89AA     Inactive decorative elements

  Primary 500     #596789     Secondary primary actions

  Primary 600     #3F4A6B     Main brand color

  Primary 700     #323B57     Hover state

  Primary 800     #272E44     Pressed state

  Primary 900     #1C2131     Dark-mode surfaces
  -----------------------------------------------------------------------

**Secondary Color --- Warm Paper**

**Secondary 500: #D6B98C**

Warm Paper introduces a soft literary and traditional character without
making the interface appear old-fashioned.

Recommended uses:

-   Decorative highlights.

-   Secondary badges.

-   Poetry-form tags.

-   Section dividers.

-   Subtle illustrations.

-   Selected quotation marks.

-   Warm hover backgrounds.

Supporting secondary shades:

  -----------------------------------------------------------------------
  **Token**            **Hex**      **Recommended use**
  -------------------- ------------ -------------------------------------
  Secondary 50         #FCF8F1      Warm page sections

  Secondary 100        #F7EEDC      Card backgrounds

  Secondary 200        #ECD9B8      Decorative borders

  Secondary 300        #E1C797      Stronger decorative accents

  Secondary 400        #D6B98C      Main secondary color

  Secondary 500        #BE9863      Icons and stronger labels

  Secondary 600        #9D7747      Hover or pressed state

  Secondary 700        #795936      Dark text on warm surfaces
  -----------------------------------------------------------------------

**Accent Color --- Jade Green**

**Accent 500: #4F7A68**

Jade Green gives the application a natural, distinctly
Vietnamese-inspired accent while remaining calm and professional.

Recommended uses:

-   Save actions.

-   Positive feedback.

-   Active filters.

-   "Matched criteria" tags.

-   Success indicators.

-   Small visual details.

-   Context-relevance highlights.

Supporting accent shades:

  ------------------------------------------------------------------------
  **Token**       **Hex**       **Recommended use**
  --------------- ------------- ------------------------------------------
  Accent 50       #F1F6F3       Light accent surfaces

  Accent 100      #DFEBE5       Tags and selected backgrounds

  Accent 200      #BED5CA       Borders

  Accent 300      #93B6A6       Secondary accent icons

  Accent 400      #6D9583       Hover states

  Accent 500      #4F7A68       Main accent

  Accent 600      #3F6254       Button hover

  Accent 700      #324E43       Pressed state
  ------------------------------------------------------------------------

**2.2 Light-Mode Background Colors**

Light mode should be the default experience because the project calls
for a bright, simple interface.

  -----------------------------------------------------------------------
  **Token**             **Hex**      **Usage**
  --------------------- ------------ ------------------------------------
  Background Canvas     #F8F6F1      Main page background

  Background Warm       #FCF8F1      Landing sections and poetry areas

  Surface Primary       #FFFFFF      Cards, panels, dialogs

  Surface Secondary     #F4F2ED      Secondary containers

  Surface Muted         #ECEAE5      Disabled or inactive areas

  Surface Elevated      #FFFFFF      Modals, drawers, floating panels

  Overlay               #1C213166    Modal and drawer overlay

  Poem Surface          #FFFCF7      Generated poem container
  -----------------------------------------------------------------------

**Recommended Usage**

Use #F8F6F1 instead of pure white for the full page background. This
reduces eye strain and creates a subtle paper-like atmosphere.

Use pure white mainly for:

-   Forms.

-   Cards.

-   Side panels.

-   Dialogs.

-   Technical tables.

Use #FFFCF7 for the generated poem to visually separate literary content
from interface controls.

**2.3 Dark-Mode Background Colors**

Dark mode is optional for the MVP. It should only be implemented if the
team has enough time to design and test it properly.

  ------------------------------------------------------------------------
  **Token**               **Hex**        **Usage**
  ----------------------- -------------- ---------------------------------
  Background Canvas       #17191F        Main dark background

  Background Warm         #1D1E22        Literary content sections

  Surface Primary         #22252D        Cards and panels

  Surface Secondary       #292D36        Secondary containers

  Surface Muted           #30343D        Disabled or inactive areas

  Surface Elevated        #353943        Modals and drawers

  Poem Surface            #202126        Generated poem container

  Overlay                 #00000099      Modal overlay
  ------------------------------------------------------------------------

Dark mode should use warm, slightly desaturated blacks rather than pure
black.

Avoid using #000000 for major surfaces because it creates excessive
contrast and does not match the calm literary direction.

**2.4 Text Colors**

**Light Mode**

  -----------------------------------------------------------------------
  **Token**            **Hex**       **Usage**
  -------------------- ------------- ------------------------------------
  Text Primary         #252932       Headings and main content

  Text Secondary       #5F6673       Supporting descriptions

  Text Tertiary        #7D8490       Metadata and captions

  Text Disabled        #A8ADB5       Disabled controls

  Text Inverse         #FFFFFF       Text on dark buttons

  Text Link            #3F4A6B       Links

  Text Link Hover      #272E44       Hovered links

  Text Poetry          #292823       Generated poem text
  -----------------------------------------------------------------------

**Dark Mode**

  ------------------------------------------------------------------------
  **Token**             **Hex**      **Usage**
  --------------------- ------------ -------------------------------------
  Text Primary          #F4F2ED      Headings and main content

  Text Secondary        #C0C4CC      Supporting descriptions

  Text Tertiary         #969CA7      Metadata and captions

  Text Disabled         #666C76      Disabled controls

  Text Inverse          #1C2131      Text on light buttons

  Text Link             #A5AEC7      Links

  Text Link Hover       #C9CFDF      Hovered links

  Text Poetry           #F2EDE3      Generated poem text
  ------------------------------------------------------------------------

**Text Usage Rules**

-   Use Text Primary for page titles, card titles, form labels, and poem
    titles.

-   Use Text Secondary for descriptions, helper text, and navigation
    items.

-   Use Text Tertiary for dates, document IDs, retrieval ranks, and
    secondary metadata.

-   Never use disabled text colors for important information.

-   Use a maximum of three text-color levels within one component.

**2.5 Border and Divider Colors**

**Light Mode**

  -----------------------------------------------------------------------
  **Token**           **Hex**       **Usage**
  ------------------- ------------- -------------------------------------
  Border Subtle       #E4E1DA       Card and section borders

  Border Default      #D5D2CA       Inputs and standard controls

  Border Strong       #B8B5AD       High-emphasis boundaries

  Divider             #E9E6DF       Section dividers

  Focus Ring          #596789       Keyboard focus
  -----------------------------------------------------------------------

**Dark Mode**

  ------------------------------------------------------------------------
  **Token**            **Hex**       **Usage**
  -------------------- ------------- -------------------------------------
  Border Subtle        #30343D       Card boundaries

  Border Default       #414650       Input borders

  Border Strong        #5B616C       High-emphasis boundaries

  Divider              #30343D       Section dividers

  Focus Ring           #A5AEC7       Keyboard focus
  ------------------------------------------------------------------------

**2.6 Status Colors**

**Success**

**Success 600: #34745A**

  ------------------------------------------------------------------------
  **Token**                    **Hex**       **Usage**
  ---------------------------- ------------- -----------------------------
  Success Background           #EAF5EF       Success alerts

  Success Border               #A8D4BE       Alert borders

  Success Default              #34745A       Icons and labels

  Success Strong               #255B45       Text and hover states
  ------------------------------------------------------------------------

Use for:

-   Poem saved.

-   Content copied.

-   Retrieval completed.

-   Generation completed.

-   Valid form input.

-   Positive feedback.

**Error**

**Error 600: #B54747**

  -----------------------------------------------------------------------
  **Token**                 **Hex**       **Usage**
  ------------------------- ------------- -------------------------------
  Error Background          #FCEEEE       Error alerts

  Error Border              #EDB8B8       Error borders

  Error Default             #B54747       Error icons and labels

  Error Strong              #8E3030       Destructive actions
  -----------------------------------------------------------------------

Use for:

-   Required-field errors.

-   Backend failure.

-   Generation failure.

-   Delete actions.

-   Invalid configuration.

**Warning**

**Warning 600: #A36A22**

  ------------------------------------------------------------------------
  **Token**                        **Hex**        **Usage**
  -------------------------------- -------------- ------------------------
  Warning Background               #FFF5E5        Warning alerts

  Warning Border                   #EBCB97        Alert borders

  Warning Default                  #A36A22        Icons and labels

  Warning Strong                   #7B4C13        Warning text
  ------------------------------------------------------------------------

Use for:

-   Low retrieval relevance.

-   Poetry structure may be imperfect.

-   Unsaved changes.

-   Long generation time.

-   Missing metadata.

**Information**

**Info 600: #3E6C92**

  -----------------------------------------------------------------------
  **Token**                 **Hex**        **Usage**
  ------------------------- -------------- ------------------------------
  Info Background           #EDF5FA        Informational alerts

  Info Border               #B8D5E7        Alert borders

  Info Default              #3E6C92        Icons and labels

  Info Strong               #2C5271        Informational text
  -----------------------------------------------------------------------

Use for:

-   RAG explanations.

-   Filter-logic information.

-   Research Mode guidance.

-   Dataset notes.

-   Help tooltips.

**2.7 Interactive Color States**

**Primary Button**

  ------------------------------------------------------------------------
  **State**      **Background**                              **Text**
  -------------- ------------------------------------------- -------------
  Default        #3F4A6B                                     #FFFFFF

  Hover          #323B57                                     #FFFFFF

  Pressed        #272E44                                     #FFFFFF

  Focus          #3F4A6B with #A5AEC7 ring                   #FFFFFF

  Disabled       #C9CFDF                                     #FFFFFF

  Loading        #3F4A6B                                     #FFFFFF
  ------------------------------------------------------------------------

**Secondary Button**

  ------------------------------------------------------------------------
  **State**       **Background**        **Border**       **Text**
  --------------- --------------------- ---------------- -----------------
  Default         #FFFFFF               #D5D2CA          #3F4A6B

  Hover           #F2F4F8               #A5AEC7          #323B57

  Pressed         #E4E7EF               #7C89AA          #272E44

  Disabled        #F4F2ED               #E4E1DA          #A8ADB5
  ------------------------------------------------------------------------

**Destructive Button**

  ------------------------------------------------------------------------
  **State**             **Background**                **Text**
  --------------------- ----------------------------- --------------------
  Default               #B54747                       #FFFFFF

  Hover                 #9C3939                       #FFFFFF

  Pressed               #7D2D2D                       #FFFFFF

  Disabled              #EDB8B8                       #FFFFFF
  ------------------------------------------------------------------------

**2.8 Color Usage Proportions**

Recommended visual balance:

-   65% neutral backgrounds and surfaces.

-   20% typography and borders.

-   10% primary color.

-   5% secondary and accent colors.

Do not use the primary, secondary, and accent colors at equal strength.

Primary color should indicate action and navigation.

Secondary color should create warmth.

Accent color should highlight context, successful actions, or selected
metadata.

**2.9 Color Accessibility Rules**

-   Normal body text should maintain at least a 4.5:1 contrast ratio.

-   Large text should maintain at least a 3:1 contrast ratio.

-   Do not communicate status through color alone.

-   Pair every status color with an icon, label, or descriptive message.

-   All keyboard-focus states should include a visible focus ring.

-   Avoid placing warm beige text on white backgrounds.

-   Avoid using Accent Green for long paragraphs.

-   Do not use light-gray text for form labels.

**3. Typography**

**3.1 Font Families**

**Heading and Interface Font**

**Be Vietnam Pro**

Fallback stack:

\"Be Vietnam Pro\", \"Inter\", \"Segoe UI\", Arial, sans-serif

Recommended uses:

-   Navigation.

-   Buttons.

-   Form labels.

-   Page headings.

-   Cards.

-   Metadata.

-   Alerts.

-   Research Mode.

-   Tables.

Reasons for selection:

-   Modern and readable.

-   Appropriate for Vietnamese interface content.

-   Clear Vietnamese diacritics.

-   Available in a broad range of weights.

-   Suitable for both creative and technical screens.

**Poetry and Literary Display Font**

**Lora**

Fallback stack:

\"Lora\", \"Noto Serif\", Georgia, serif

Recommended uses:

-   Generated poem text.

-   Poem titles.

-   Poetry excerpts.

-   Literary quotations.

-   Selected landing-page headings.

-   Empty-state literary messages.

Do not use Lora for:

-   Small labels.

-   Buttons.

-   Form helper text.

-   Dense technical tables.

-   Retrieval scores.

**Monospace Font**

**JetBrains Mono**

Fallback stack:

\"JetBrains Mono\", \"Roboto Mono\", Consolas, monospace

Recommended uses:

-   Document IDs.

-   Model names.

-   API responses.

-   Raw JSON.

-   Prompt previews.

-   Retrieval scores.

-   Research Mode technical data.

Monospace typography should not appear in the standard creative flow
unless necessary.

**3.2 Typography Scale**

The system uses a balanced scale suitable for desktop and mobile
layouts.

  ---------------------------------------------------------------------------------
  **Style**    **Desktop   **Mobile   **Weight**   **Line     **Typical use**
               size**      size**                  height**   
  ------------ ----------- ---------- ------------ ---------- ---------------------
  Display      48 px       36 px      700          1.15       Landing hero

  H1           40 px       32 px      700          1.2        Main page title

  H2           32 px       28 px      700          1.25       Major sections

  H3           24 px       22 px      600          1.35       Card groups and
                                                              panels

  H4           20 px       18 px      600          1.4        Component headings

  Body Large   18 px       18 px      400          1.6        Introductions

  Body         16 px       16 px      400          1.5        Standard content

  Body Medium  16 px       16 px      500          1.5        Emphasized UI text

  Small        14 px       14 px      400          1.45       Helper text and
                                                              metadata

  Small Medium 14 px       14 px      500          1.45       Small labels

  Caption      12 px       12 px      400          1.4        Timestamps and IDs

  Button Large 16 px       16 px      600          1.25       Primary actions

  Button Small 14 px       14 px      600          1.2        Secondary actions

  Poem Title   30 px       26 px      600          1.35       Generated poem title

  Poem Body    20 px       18 px      400          1.9        Generated poem

  Poem Excerpt 16 px       16 px      400          1.75       Retrieved source
                                                              excerpt

  Code         13 px       12 px      400          1.6        Research Mode data
  ---------------------------------------------------------------------------------

**3.3 Heading Styles**

**Display**

-   Font: Be Vietnam Pro.

-   Size: 48 px desktop, 36 px mobile.

-   Weight: 700.

-   Line height: 1.15.

-   Letter spacing: -0.02em.

-   Maximum width: approximately 720 px.

Use only once on the Landing Page.

**H1**

-   Font: Be Vietnam Pro.

-   Size: 40 px desktop, 32 px mobile.

-   Weight: 700.

-   Line height: 1.2.

-   Letter spacing: -0.015em.

Use for one main page title per page.

Examples:

-   "Sáng tác bài thơ mới"

-   "Lịch sử sáng tác"

-   "Cách hệ thống hoạt động"

**H2**

-   Font: Be Vietnam Pro.

-   Size: 32 px desktop, 28 px mobile.

-   Weight: 700.

-   Line height: 1.25.

-   Letter spacing: -0.01em.

Use for major page sections.

**H3**

-   Font: Be Vietnam Pro.

-   Size: 24 px desktop, 22 px mobile.

-   Weight: 600.

-   Line height: 1.35.

Use for:

-   Main cards.

-   Result sections.

-   Input groups.

-   Source panels.

**H4**

-   Font: Be Vietnam Pro.

-   Size: 20 px desktop, 18 px mobile.

-   Weight: 600.

-   Line height: 1.4.

Use for:

-   Subsections.

-   Dialog titles.

-   Source-card headings.

-   Advanced-setting groups.

**3.4 Body Styles**

**Body Large**

-   Size: 18 px.

-   Weight: 400.

-   Line height: 1.6.

-   Maximum paragraph width: 680 px.

Use for:

-   Hero supporting text.

-   Important explanations.

-   About-page introductions.

**Body Default**

-   Size: 16 px.

-   Weight: 400.

-   Line height: 1.5.

Use for:

-   Normal paragraphs.

-   Form values.

-   Card content.

-   General descriptions.

**Body Medium**

-   Size: 16 px.

-   Weight: 500.

-   Line height: 1.5.

Use for:

-   Navigation items.

-   Selected options.

-   Important metadata.

-   Dialog actions.

**Small**

-   Size: 14 px.

-   Weight: 400.

-   Line height: 1.45.

Use for:

-   Form helper text.

-   Secondary metadata.

-   Explanations.

-   Source information.

**Caption**

-   Size: 12 px.

-   Weight: 400.

-   Line height: 1.4.

Use for:

-   Timestamps.

-   Retrieval rank.

-   Character counters.

-   Document identifiers.

-   Minor technical information.

Do not use 12 px text for important instructions or interactive
controls.

**3.5 Poetry Typography**

Generated poetry requires more generous spacing than normal interface
content.

**Poem Title**

-   Font: Lora.

-   Size: 30 px desktop, 26 px mobile.

-   Weight: 600.

-   Line height: 1.35.

-   Letter spacing: -0.01em.

-   Alignment: centered by default.

**Poem Body**

-   Font: Lora.

-   Size: 20 px desktop, 18 px mobile.

-   Weight: 400.

-   Line height: 1.9.

-   Letter spacing: 0.005em.

-   Paragraph spacing: 20--24 px between stanzas.

-   Alignment: left by default.

-   Maximum line width: 620 px.

Centered poetry may be used when:

-   The poem has short lines.

-   The layout remains readable.

-   The selected poetic form benefits from centered presentation.

Left alignment is safer for:

-   Free verse.

-   Long lines.

-   Mobile devices.

-   Accessibility.

**Retrieved Poem Excerpt**

-   Font: Lora.

-   Size: 16 px.

-   Weight: 400.

-   Line height: 1.75.

-   Maximum visible lines: 3--5.

-   Use truncation with "Xem thêm" for longer excerpts.

**Poetry Typography Rules**

-   Preserve intentional line breaks.

-   Never justify poem text.

-   Do not automatically merge lines.

-   Do not use all-uppercase poem titles.

-   Do not reduce line height below 1.65.

-   Avoid placing long poems inside narrow cards.

-   Keep the main generated poem wider than retrieved-source cards.

**3.6 Font Weights**

  -----------------------------------------------------------------------
  **Weight name**  **Numeric value** **Usage**
  ---------------- ----------------- ------------------------------------
  Regular          400               Body text and poem content

  Medium           500               Form labels and navigation

  Semi-Bold        600               Card titles and buttons

  Bold             700               Page titles and major headings
  -----------------------------------------------------------------------

Avoid:

-   Weight 300 for body text.

-   Weight 800 or 900 for literary content.

-   Excessive bold text inside poems.

-   Using more than three weights on one screen.

**3.7 Typography Hierarchy Rules**

-   Each page should contain one H1.

-   Do not skip heading levels without a layout reason.

-   Form labels should be 14--16 px with weight 500.

-   Helper text should be visually lighter than labels.

-   Button text should use weight 600.

-   Poetry content should not use the same type style as interface
    descriptions.

-   Technical data should use monospace only where alignment or code
    readability matters.

-   Keep text lines between approximately 45 and 75 characters for
    long-form descriptions.

-   Avoid long centered paragraphs.

-   Do not use uppercase styling for Vietnamese navigation labels.

**3.8 Figma Typography Style Names**

Recommended Figma naming:

Typography/Display

Typography/Heading/H1

Typography/Heading/H2

Typography/Heading/H3

Typography/Heading/H4

Typography/Body/Large

Typography/Body/Default

Typography/Body/Medium

Typography/Body/Small

Typography/Caption

Typography/Button/Large

Typography/Button/Small

Typography/Poetry/Title

Typography/Poetry/Body

Typography/Poetry/Excerpt

Typography/Code/Default

**4. Spacing System**

**4.1 Base Unit**

Use a **4 px base spacing system**.

All margins, padding, gaps, component dimensions, and layout distances
should normally use multiples of 4.

This creates consistency and maps cleanly to Tailwind CSS spacing
conventions.

**4.2 Spacing Scale**

  -------------------------------------------------------------------------
  **Token**      **Value**   **Common usage**
  -------------- ----------- ----------------------------------------------
  Space 0        0 px        No spacing

  Space 1        4 px        Icon-detail gap

  Space 2        8 px        Tight internal spacing

  Space 3        12 px       Label-to-helper spacing

  Space 4        16 px       Default component spacing

  Space 5        20 px       Medium internal padding

  Space 6        24 px       Card padding and section gaps

  Space 8        32 px       Large component separation

  Space 10       40 px       Major panel spacing

  Space 12       48 px       Section separation

  Space 16       64 px       Large page sections

  Space 20       80 px       Landing-page vertical spacing

  Space 24       96 px       Major hero spacing

  Space 32       128 px      Large desktop-only separation
  -------------------------------------------------------------------------

**4.3 Semantic Spacing Names**

  --------------------------------------------------------------------------
  **Semantic token**       **Value**   **Recommended use**
  ------------------------ ----------- -------------------------------------
  XXS                      4 px        Icon and label

  XS                       8 px        Closely related elements

  SM                       12 px       Compact field content

  MD                       16 px       Standard spacing

  LG                       24 px       Card and form groups

  XL                       32 px       Panel sections

  2XL                      48 px       Major page sections

  3XL                      64 px       Large page separation

  4XL                      80 px       Landing sections

  5XL                      96 px       Hero spacing
  --------------------------------------------------------------------------

Use either numeric or semantic naming consistently. Do not mix both
systems inside Figma components.

**4.4 Component Internal Spacing**

**Buttons**

**Large Button**

-   Height: 48 px.

-   Horizontal padding: 20--24 px.

-   Icon-to-label gap: 8 px.

-   Minimum width: 120 px.

**Default Button**

-   Height: 44 px.

-   Horizontal padding: 16--20 px.

-   Icon-to-label gap: 8 px.

**Small Button**

-   Height: 36 px.

-   Horizontal padding: 12--16 px.

-   Icon-to-label gap: 6--8 px.

**Inputs**

-   Default height: 44 px.

-   Large height: 48 px.

-   Horizontal padding: 12--16 px.

-   Label-to-input gap: 8 px.

-   Input-to-helper gap: 6--8 px.

-   Input-to-error gap: 6--8 px.

**Textarea**

-   Minimum height: 120 px.

-   Recommended generator height: 140--160 px.

-   Internal padding: 16 px.

-   Character-counter distance: 8 px.

**Select and Combobox**

-   Height: 44--48 px.

-   Horizontal padding: 12--16 px.

-   Icon gap: 8 px.

-   Dropdown item padding: 10--12 px vertically and 12--16 px
    horizontally.

**Cards**

**Compact Card**

-   Internal padding: 16 px.

-   Element gap: 12 px.

**Standard Card**

-   Internal padding: 24 px.

-   Element gap: 16 px.

**Large Feature Card**

-   Internal padding: 32 px.

-   Element gap: 20--24 px.

**Dialogs**

-   Desktop padding: 24--32 px.

-   Mobile padding: 20--24 px.

-   Header-to-content gap: 20--24 px.

-   Content-to-actions gap: 24--32 px.

-   Action-button gap: 8--12 px.

**Source Cards**

-   Internal padding: 16 px.

-   Metadata gap: 8 px.

-   Title-to-metadata gap: 6--8 px.

-   Metadata-to-excerpt gap: 12 px.

-   Excerpt-to-action gap: 16 px.

**Generated Poem Card**

-   Desktop padding: 40--48 px.

-   Tablet padding: 32 px.

-   Mobile padding: 20--24 px.

-   Title-to-poem gap: 24--32 px.

-   Stanza gap: 20--24 px.

-   Poem-to-actions gap: 32 px.

**4.5 Form Spacing**

**Inside a Field Group**

Label

8 px

Input

8 px

Helper or error text

**Between Related Fields**

Use 16 px.

Example:

-   Author field and literary-period field.

-   Top-k and creativity settings.

**Between Different Form Sections**

Use 24--32 px.

Example:

-   Required inputs and optional preferences.

-   Standard settings and advanced settings.

**Between Form and Main Action**

Use 32 px.

The primary Generate button should not appear visually attached to the
final input field.

**4.6 Page-Level Spacing**

**Desktop**

-   Header horizontal padding: 48--64 px.

-   Page horizontal padding: 48--64 px.

-   Page top padding after header: 40--48 px.

-   Page bottom padding: 64--80 px.

-   Section gap: 64--80 px.

-   Maximum content width: 1280--1440 px.

**Tablet**

-   Horizontal padding: 32 px.

-   Section gap: 48--64 px.

-   Card gap: 24 px.

**Mobile**

-   Horizontal padding: 16--20 px.

-   Top padding: 24--32 px.

-   Section gap: 40--48 px.

-   Card gap: 16 px.

-   Bottom safe spacing: at least 24 px.

**4.7 Generator Workspace Spacing**

**Desktop Three-Column Layout**

Recommended structure:

-   Left input panel: 320--360 px.

-   Center poem area: minimum 520 px.

-   Right source panel: 320--360 px.

-   Column gap: 24 px.

-   Workspace outer padding: 24--32 px.

**Two-Column Layout**

-   Main content: approximately 65%.

-   Side panel: approximately 35%.

-   Column gap: 24--32 px.

**Mobile Layout**

Stack sections in this order:

1.  Input form.

2.  Generate button.

3.  Generated poem.

4.  Main result actions.

5.  Retrieved sources.

6.  Feedback.

Use 32--40 px between major sections.

**4.8 Grid System**

**Desktop**

-   12-column grid.

-   Maximum width: 1280 px.

-   Gutter: 24 px.

-   Outer margins: 48--64 px.

**Tablet**

-   8-column grid.

-   Gutter: 20--24 px.

-   Outer margins: 32 px.

**Mobile**

-   4-column grid.

-   Gutter: 16 px.

-   Outer margins: 16--20 px.

**4.9 Recommended Breakpoints**

  ------------------------------------------------------------------------
  **Breakpoint**   **Width**           **Main behavior**
  ---------------- ------------------- -----------------------------------
  Mobile Small     320--479 px         Single-column layout

  Mobile Large     480--767 px         Single column with larger cards

  Tablet           768--1023 px        Two-column where appropriate

  Desktop          1024--1439 px       Two- or three-column layout

  Desktop Large    1440 px and above   Centered maximum-width content
  ------------------------------------------------------------------------

Do not design only for the exact frame width. Components should use
constraints and Auto Layout so they adapt between breakpoints.

**4.10 Vertical Rhythm**

Use consistent vertical patterns:

**Compact Pattern**

8 → 12 → 16 px

For:

-   Metadata.

-   Compact cards.

-   Dropdown items.

**Standard Pattern**

8 → 16 → 24 px

For:

-   Form sections.

-   Result metadata.

-   Alerts.

**Spacious Literary Pattern**

16 → 24 → 32 → 48 px

For:

-   Generated poetry.

-   Landing sections.

-   About-page content.

-   Literary examples.

Poetry areas should use more vertical space than technical areas.

**4.11 Spacing Rules**

-   Use 8 px between an icon and its label.

-   Use 12--16 px between items inside a compact component.

-   Use 24 px as the default card padding.

-   Use 32 px between major content groups.

-   Use 48--64 px between page sections.

-   Avoid arbitrary values such as 13 px, 19 px, or 27 px.

-   Use consistent spacing in both Figma and Tailwind implementation.

-   Do not reduce mobile touch-target spacing below 8 px.

-   Maintain a minimum interactive target size of approximately 44 × 44
    px.

-   Keep destructive actions separated from primary actions.

-   Use more whitespace around the generated poem than around retrieved
    metadata.

**5. Figma Token Naming**

**5.1 Color Style Names**

Color/Brand/Primary/50

Color/Brand/Primary/100

Color/Brand/Primary/200

Color/Brand/Primary/300

Color/Brand/Primary/400

Color/Brand/Primary/500

Color/Brand/Primary/600

Color/Brand/Primary/700

Color/Brand/Primary/800

Color/Brand/Primary/900

Color/Brand/Secondary/50

Color/Brand/Secondary/100

Color/Brand/Secondary/200

Color/Brand/Secondary/300

Color/Brand/Secondary/400

Color/Brand/Secondary/500

Color/Brand/Secondary/600

Color/Brand/Secondary/700

Color/Brand/Accent/50

Color/Brand/Accent/100

Color/Brand/Accent/200

Color/Brand/Accent/300

Color/Brand/Accent/400

Color/Brand/Accent/500

Color/Brand/Accent/600

Color/Brand/Accent/700

Color/Background/Canvas

Color/Background/Warm

Color/Surface/Primary

Color/Surface/Secondary

Color/Surface/Muted

Color/Surface/Elevated

Color/Surface/Poem

Color/Text/Primary

Color/Text/Secondary

Color/Text/Tertiary

Color/Text/Disabled

Color/Text/Inverse

Color/Text/Link

Color/Border/Subtle

Color/Border/Default

Color/Border/Strong

Color/Border/Focus

Color/Status/Success

Color/Status/Error

Color/Status/Warning

Color/Status/Info

**5.2 Spacing Variable Names**

Spacing/0 = 0

Spacing/1 = 4

Spacing/2 = 8

Spacing/3 = 12

Spacing/4 = 16

Spacing/5 = 20

Spacing/6 = 24

Spacing/8 = 32

Spacing/10 = 40

Spacing/12 = 48

Spacing/16 = 64

Spacing/20 = 80

Spacing/24 = 96

Spacing/32 = 128

**5.3 Mode Structure**

Use Figma variable modes:

Mode: Light

Mode: Dark

Brand colors can remain mostly consistent, while background, surface,
text, and border tokens switch between modes.

**6. CSS Token Reference**

:root {

/\* Brand \*/

\--color-primary: #3f4a6b;

\--color-primary-hover: #323b57;

\--color-primary-pressed: #272e44;

\--color-secondary: #d6b98c;

\--color-accent: #4f7a68;

/\* Backgrounds \*/

\--color-background: #f8f6f1;

\--color-background-warm: #fcf8f1;

\--color-surface: #ffffff;

\--color-surface-secondary: #f4f2ed;

\--color-surface-muted: #eceae5;

\--color-poem-surface: #fffcf7;

/\* Text \*/

\--color-text-primary: #252932;

\--color-text-secondary: #5f6673;

\--color-text-tertiary: #7d8490;

\--color-text-disabled: #a8adb5;

\--color-text-inverse: #ffffff;

\--color-text-poetry: #292823;

/\* Borders \*/

\--color-border-subtle: #e4e1da;

\--color-border-default: #d5d2ca;

\--color-border-strong: #b8b5ad;

\--color-focus: #596789;

/\* Status \*/

\--color-success: #34745a;

\--color-error: #b54747;

\--color-warning: #a36a22;

\--color-info: #3e6c92;

/\* Spacing \*/

\--space-1: 4px;

\--space-2: 8px;

\--space-3: 12px;

\--space-4: 16px;

\--space-5: 20px;

\--space-6: 24px;

\--space-8: 32px;

\--space-10: 40px;

\--space-12: 48px;

\--space-16: 64px;

\--space-20: 80px;

\--space-24: 96px;

}

\[data-theme=\"dark\"\] {

\--color-background: #17191f;

\--color-background-warm: #1d1e22;

\--color-surface: #22252d;

\--color-surface-secondary: #292d36;

\--color-surface-muted: #30343d;

\--color-poem-surface: #202126;

\--color-text-primary: #f4f2ed;

\--color-text-secondary: #c0c4cc;

\--color-text-tertiary: #969ca7;

\--color-text-disabled: #666c76;

\--color-text-inverse: #1c2131;

\--color-text-poetry: #f2ede3;

\--color-border-subtle: #30343d;

\--color-border-default: #414650;

\--color-border-strong: #5b616c;

\--color-focus: #a5aec7;

}

**7. Recommended Default Combination**

For the first Figma screens, use the following combination:

-   Main background: #F8F6F1

-   Primary surface: #FFFFFF

-   Generated poem surface: #FFFCF7

-   Primary action: #3F4A6B

-   Secondary highlight: #D6B98C

-   Accent and matched-source tags: #4F7A68

-   Main text: #252932

-   Secondary text: #5F6673

-   Borders: #D5D2CA

-   Interface font: Be Vietnam Pro

-   Poetry font: Lora

-   Standard body size: 16 px

-   Generated poem size: 20 px

-   Default card padding: 24 px

-   Default section spacing: 48--64 px

-   Default component gap: 16 px

This combination should be used to design the first high-fidelity
Generator and Generation Result screens before creating additional
visual variations.

Build out all pages as separate page components with full functionality,
content, and styling according to the design system. Make this a
complete, working prototype.
