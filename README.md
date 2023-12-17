# <img src="icon.png" width="40px"> 自動巴哈發文 Auto Baha Post

如果你有固定在[巴哈姆特](https://forum.gamer.com.tw/)論壇發文的習慣，但遊戲正打得火熱，或是臨時有事無法守在電腦前。
使用此應用程式即可自動化發表你的文章。

If you have the habit of publishing articles on the [Bahamut](https://forum.gamer.com.tw/) forum.
But the game is pretty intense , or you're unable to sit in front of the computer right now.
By using this application, you can automate publishing activities.

輸入標題、文章內容，選擇想要發表的看板，就可以指定你想要發表的時間。選擇看板的時候需要提供看板編號，可以在該看板的網址列中找到。

> 舉例來說，`測試區`看板的網址為 [https://forum.gamer.com.tw/A.php?bsn=60111](https://forum.gamer.com.tw/A.php?bsn=60111)
>
> 網址中的字串 _bsn=60111_ 代表的是看板編號(**b**oard **s**erial **n**umber)的鍵與值
>
> 也就是說`測試區`看板的編號為: **60111**

Enter the title, the content of the article, and select the board you want to publish, then you can specify the time you want to publish. When selecting a board, you need to provide the board serial number, which can be found in the URL bar of the board page.

> For example, the `Testing` board's URL is [https://forum.gamer.com.tw/A.php?bsn=60111](https://forum.gamer.com.tw/A.php?bsn=60111)
>
> The string _bsn=60111_ in the URL represents the key and value of the **b**oard **s**erial **n**umber.
>
> This indicates the board serial number of the `Testing` board is: **60111**.

準備好文章之後，只要確保此應用程式在指定的發表時間有在執行，文章就會自動發表出去

After the article is prepared and the application is confirmed to be running at the scheduled time, the article will be published automatically.

## 設定檔 Congifuration

在程式安裝的資料夾中，有名為`.env`的檔案，你可以根據個人需要調整參數

There is a file named `.env` in the installation directory of the application. You can adjust the parameters according to your needs.

```bash
# 應用程式執行環境
# The environment of the application.
NODE_ENV=production

# 開啟偵錯介面
# Open the debugging panel.
DEBUG=0 # 0 or 1

# 應用程式背景運行的伺服器連接埠
# The port is used by the server running in the background.
API_PORT=48763

# 應用程式介面預設語言，僅支援 英文(en) 以及 中文(zh-tw)
# The default language of the application, only support english(en) and traditional chinese(zh-tw)
LNG="zh-tw" # "en" or "zh-tw"

# 資料儲存的位置，路徑相對於程式執行檔
# The directory where the file is saved. Relative to the application executable.
DATABASE_URL="./resources/database.sqlite"
```

## Development

```bash
# Start the application without packaging for testing
npm run dev

# Package all the assets into the "./dist" folder
npm run dist

# Clear all built assets
npm run clean

# Start the jest watcher
npm run test

# Bump the application version and update the CHANGELOG.md
npx release-it
```
