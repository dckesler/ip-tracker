## IP Request Tracking

### Solution One (The shortcut)
This solution is in `index.ts` and can be verified with running `test.ts`.
This was my first solution and it felt *too* easy. Probably because it was.
It makes the assumption that after the top 100 we don't actually care about
the order of any of the other IP addresses.

The `findNewIndex` function is going to be the bottleneck here and if the
number of top IP addresses to track were to get too large then this would
be where things would slow down. Specifically, if there were a lot of
different IP addresses that all had the same amount of requests. In that
case it could potentially take too long to find the new index for the
IP address that just made a request since it iterates through the top list
until it finds an IP address that has more requests than the current one.

As for solutions I considered but didn't use, I'll talk more about this with
solution two which feels more complete.

The tests I've set up in `test.ts` seem pretty good and as long as the top
IPs list remains small-ish then you can do a large number of IPs and requests
fairly quickly while checking to see that the order remains correct, and the
performance stays within a certain time.

### Solution Two (The full ordering)

This solution is in `index-2.ts` and can be verified with running `test-2.ts`.
This solution feels more complete and orders all of the IP addresses and then
will just return the top 100 of those. This solution first groups IP addresses
into lists by how many requests they've made and then orders those lists
alphabetically to allow a binary search.

The assumption here is that there will be large groupings of IP addresses by
request count. Meaning that if every single unique IP address also made a
unique number of requests this solution would struggle with grabbing the top
100. However, with the binary search through the alphabetized lists it makes
moving the IP addresses between request groups pretty fast even with very
large amounts of unique addresses.

A solution I considered but didn't use was to have a single ordered list that
had a primary sort on request count and a secondary alphabetic sort on IP
address. In the end I opted out of that solution because I was unsure how
to do an accurate binary search on a double sorted listed. Meaning if I first
searched by request count and found the right grouping I couldn't think of any
way after that to correctly set the boundaries for the alphabetic search if
using a single list.

The slowest function in this solution could potentially be the top100 function
at the end. As I said above if for some reason the IP address with the most
requests was in its own group, and the second was by itself, and so on then
the ordering of the request groups would theoretically be ordering a list of
20 million different numbers, which would slow it down significantly.

As for the adding and removing of addresses from their groups we have a direct
look up for the request group and then a binary search through the alphabetized
list. So even at large amounts of IP addresses grouped together it doesn't take
long to find the IP address or the insertion point. ( O(log n) worst case ).
Potentially one thing that could slow this down is when adding an IP address
to one of the groups the earlier in the list it ends up the more indices need
to be re-done under the hood since it's stored in an array.
