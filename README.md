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

## Dane demonstracyjne

Po pierwszym otwarciu strony gość widzi 12 przykładowych dzieł (9 dostępnych i 3 sprzedane), 3 portfolio, 3 zamówienia i 2 opinie. Dane są fikcyjne i oznaczone banerem. Zestaw znajduje się w `demo-data.js` i zapisuje się wyłącznie pod kluczami `artvint_demo_clean_*` w localStorage. Nie tworzy zwykłych kont ani sesji.

Kliknij **Zaloguj się** i wybierz konto testowe, bez wpisywania hasła:

| Konto | Co pokazać |
| --- | --- |
| Piotr (`@piotr_kolekcjoner`) | Ulubione prace, 2 zakupy, certyfikat i zakup czekający na opinię, własne portfolio fotografii |
| Marta (`@marta_asp`) | Portfolio malarstwa i grafiki, wystawianie i edycja, sprzedaż, zakup bez certyfikatu |
| Glina w Ogniu (`@glina_w_ogniu`) | Ceramika, zamówienia Custom, sprzedana praca i przykłady do moderacji |
| Administrator (`@admin`) | Konta testowe, wszystkie zamówienia, analiza i zatwierdzanie prac |

Przykłady obejmują prace zatwierdzone, niezweryfikowane, oczekujące na decyzję oraz zdjęcie o wymiarach 80 × 80 px, które nie przechodzi analizy jakościowej. Certyfikaty i transakcje w tym zestawie służą wyłącznie demonstracji.

Dane wczytują się jednorazowo. Pierwsza inicjalizacja zachowuje istniejące przykładowe prace i zmiany użytkownika, a kolejne otwarcia nie przywracają usuniętych ofert. Przycisk **Przywróć przykładowe dane** odtwarza katalog, portfolio, zamówienia i opinie w trybie demonstracyjnym. Nie usuwa kont ani danych zwykłych użytkowników. Usunięte konta testowe wymagają ponownego uruchomienia backendu.

Zwykłe konta zachowują osobny, początkowo pusty katalog. Katalog i portfolio można przeglądać bez logowania. Zakup, ulubione i zapytania Custom wymagają konta. Po wylogowaniu katalog zachowuje ostatnio przeglądany zestaw prac również po odświeżeniu strony. Oferty nadal zapisują się lokalnie w przeglądarce.

### Zdjęcia poglądowe

Zestaw korzysta z adresów zdjęć Unsplash używanych wcześniej w prototypie (`script.js`): `photo-1565193566173-7a0ee3dbe261`, `photo-1582555172866-f73bb12a2ab3`, `photo-1544967082-d9d25d867d66`, `photo-1507525428034-b723cf961d3e`, `photo-1513519245088-0e12902e5a38` i `photo-1578301978693-85fa9c0320b9`. Obrazy nie przedstawiają prac fikcyjnych kont. Pełne adresy znajdują się przy rekordach w `demo-data.js`. Wczytanie zdjęć wymaga internetu.

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
