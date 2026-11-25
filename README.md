# ArtVint

## Uruchomienie backendu

Wymagany jest Node.js 22.13 lub nowszy.

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Otwórz [ArtVint na localhost](http://127.0.0.1:3000). W trybie serwerowym formularz ma osobne przyciski rejestracji i logowania. Konta, sesje, dane resetu, blokady e-maili i czat zapisują się w SQLite. Katalog, zamówienia i portfolio korzystają z danych lokalnych przeglądarki. Konta utworzone w statycznym demo wymagają rejestracji w backendzie.

## Administrator i poczta

W pliku `.env` ustaw `ART_VINT_ADMIN_EMAIL` i `ART_VINT_ADMIN_PASSWORD`, aby przy starcie utworzyć konto `@admin`. Kolejne uruchomienia korzystają z istniejącego konta.

Dla Gmaila ustaw `ART_VINT_SMTP_HOST=smtp.gmail.com`, `ART_VINT_SMTP_PORT=465` i `ART_VINT_SMTP_USER` na adres nadawcy. Wpisz [hasło aplikacji Google](https://support.google.com/accounts/answer/185833) do `ART_VINT_SMTP_PASSWORD`. Pole `ART_VINT_MAIL_FROM` pozwala ustawić nazwę wyświetlaną nadawcy.

Alternatywnie ustaw `ART_VINT_SMTP_URL` oraz `ART_VINT_MAIL_FROM` zgodnie z danymi dostawcy SMTP. Na porcie 587 transport wymaga STARTTLS, a dla portu 465 użyj schematu `smtps://`. Po ustawieniu danych sprawdź połączenie bez wysyłania poczty poleceniem `npm.cmd run mail:check` i uruchom ponownie serwer. Link resetujący jest ważny przez 10 minut, a jego użycie zmienia hasło i kończy dotychczasowe sesje konta.

Aby link resetujący działał na urządzeniach użytkowników, ustaw adres udostępnionej strony w `ART_VINT_ORIGIN`. Przy publikacji za proxy HTTPS ustaw `ART_VINT_ORIGIN` na publiczny adres strony bez końcowego ukośnika.

## Konta testowe i pusty katalog

Katalog, pracownie, zamówienia i opinie zaczynają od pustych list. W oknie logowania dostępne są trzy zwykłe konta testowe i konto administratora testowego. Sesje i czat kont testowych korzystają z osobnej bazy w pamięci. Zwykłe konta nie pojawiają się w panelu administratora testowego.

Katalog i portfolio można przeglądać bez logowania. Zakup, ulubione i zapytania Custom wymagają konta. Po wylogowaniu katalog zachowuje ostatnio przeglądany zestaw prac (także po odświeżeniu strony), bez łączenia danych zwykłych kont i kont testowych. Oferty nadal zapisują się lokalnie w danej przeglądarce, a nowa przeglądarka bez opublikowanych prac zaczyna od pustego katalogu.

## Automaty i punkty odbioru

Koszyk pobiera rzeczywiste punkty przez backend. InPost udostępnia Paczkomaty, ORLEN Paczka udostępnia automaty, a DPD Pickup udostępnia automaty i punkty stacjonarne z polskiego katalogu MyPudo. Wyszukiwarka dopasowuje fragmenty kodu, miejscowości, ulicy i kodu pocztowego, ignorując wielkość liter oraz polskie znaki.

Endpointy to `GET /api/pickup-points/inpost`, `GET /api/pickup-points/orlen` i `GET /api/pickup-points/dpd`. Wszystkie przyjmują parametry `q` i `page`. Katalogi InPost i DPD odświeżają się co godzinę, a katalog ORLEN raz na dobę przy kolejnym wyszukiwaniu. Pierwsze pobranie może potrwać dłużej.

InPost i ORLEN nie wymagają klucza. DPD wymaga `ART_VINT_DPD_API_KEY` w `.env`. Klucz do Pickup Services MyPudo wydaje [DPD Polska](https://www.dpd.com/pl/pl/oferta-dla-firm/rozwiazania-it-dpd-polska/implementacja-wtyczek-web-service-dpd-polska/). Po dodaniu klucza uruchom ponownie backend.

## API kont

Nowe konta wymagają potwierdzenia adresu e-mail przed zalogowaniem. Backend wysyła link do `/activate-account`, ważny przez 24 godziny. Wygenerowanie nowego linku unieważnia poprzedni. Istniejące konta zachowują dostęp.

| Metoda | Endpoint | Operacja | Dostęp |
| --- | --- | --- | --- |
| POST | `/api/accounts` | Rejestracja zwykłego konta. JSON z polami `handle`, `name`, `email`, `password` | Publiczny |
| POST | `/api/accounts/activate` | Aktywacja konta. JSON z polem `token` z linku | Jednorazowy token |
| POST | `/api/accounts/resend-activation` | Ponowne wysłanie. JSON z polem `email` | Publiczny, z limitem żądań |
| GET | `/api/accounts` | Lista kont i blokad | Administrator |
| GET | `/api/accounts/@nick` | Dane wybranego konta | Właściciel lub administrator |
| PUT | `/api/accounts/@nick` | Zmiana nazwy wyświetlanej. JSON z polem `name` | Właściciel lub administrator |
| DELETE | `/api/accounts/@nick` | Usunięcie konta | Administrator, z wyjątkiem własnego konta |
| PUT | `/api/admin/block-email` | Blokada lub odblokowanie. JSON z polami `email` i `blocked` | Administrator |

Operacje wymagające logowania używają ciasteczka sesji zwróconego przez `POST /api/login`.

## Czat

Czat w trybie serwerowym pobiera rozmowy i listę aktywnych użytkowników z `GET /api/chat/threads`. Uczestnicy mogą odczytywać historię z `GET /api/chat/messages?partner=@nick` i wysyłać wiadomości przez `POST /api/chat/messages`. Otwarte okno sprawdza nowe wiadomości co sekundę i przy powrocie do karty. Zapytania o prace na wymiar trafiają do tej samej rozmowy. Każda karta ma własną sesję, więc dwa różne konta można testować w jednym profilu przeglądarki.

Stara historia zapisana w przeglądarce pozostaje dostępna dla lokalnych kont po otwarciu pliku HTML.

## Testy

```powershell
npm test
```

Test integracyjny uruchamia API na porcie przydzielonym przez system i przechwytuje wiadomość przez testowy transport, bez wysyłania jej do zewnętrznej skrzynki.
