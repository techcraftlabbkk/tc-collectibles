// Comprehensive Link Tester - Run this in Chrome DevTools Console
(async function() {
    console.clear();
    console.log('🔗 Starting comprehensive link test...\n');

    const results = {
        working: [],
        broken: [],
        errors: [],
        external: []
    };

    // Get all links on the page
    const links = Array.from(document.querySelectorAll('a[href]'));
    const uniqueUrls = new Set();

    // Filter out duplicates and unusable links
    const urlsToTest = links
        .map(link => {
            let href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:') ||
                href.startsWith('mailto:') || href.startsWith('tel:')) {
                return null;
            }
            // Convert relative URLs to absolute
            if (!href.startsWith('http')) {
                href = new URL(href, window.location.href).href;
            }
            return href;
        })
        .filter(url => url && !uniqueUrls.has(url) && !uniqueUrls.add(url));

    console.log(`📊 Found ${urlsToTest.length} unique links to test\n`);

    // Test each link
    for (let i = 0; i < urlsToTest.length; i++) {
        const url = urlsToTest[i];
        const isExternal = !url.includes(window.location.hostname);

        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: isExternal ? 'no-cors' : 'cors'
            });

            if (isExternal) {
                // For external links with CORS restrictions, we can't fully verify
                results.external.push(url);
                console.log(`⚠️  [${i + 1}/${urlsToTest.length}] EXTERNAL (unverified): ${url}`);
            } else if (response.ok || response.status < 400) {
                results.working.push(url);
                console.log(`✅ [${i + 1}/${urlsToTest.length}] OK (${response.status}): ${url}`);
            } else {
                results.broken.push({ url, status: response.status });
                console.log(`❌ [${i + 1}/${urlsToTest.length}] BROKEN (${response.status}): ${url}`);
            }
        } catch (error) {
            results.errors.push({ url, error: error.message });
            console.log(`⚠️  [${i + 1}/${urlsToTest.length}] ERROR: ${url} - ${error.message}`);
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📋 LINK TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total links tested: ${urlsToTest.length}`);
    console.log(`✅ Working: ${results.working.length}`);
    console.log(`❌ Broken: ${results.broken.length}`);
    console.log(`⚠️  Errors: ${results.errors.length}`);
    console.log(`🌐 External (unverified): ${results.external.length}`);

    if (results.broken.length > 0) {
        console.log('\n' + '='.repeat(80));
        console.log('🚨 BROKEN LINKS DETAILS');
        console.log('='.repeat(80));
        results.broken.forEach((item, idx) => {
            console.log(`\n${idx + 1}. ${item.url}`);
            console.log(`   Status Code: ${item.status}`);
        });
    }

    if (results.errors.length > 0) {
        console.log('\n' + '='.repeat(80));
        console.log('⚠️  LINKS WITH ERRORS');
        console.log('='.repeat(80));
        results.errors.forEach((item, idx) => {
            console.log(`\n${idx + 1}. ${item.url}`);
            console.log(`   Error: ${item.error}`);
        });
    }

    // Export results as JSON
    console.log('\n' + '='.repeat(80));
    console.log('📥 EXPORT RESULTS AS JSON');
    console.log('='.repeat(80));
    console.log(JSON.stringify(results, null, 2));

    console.log('\n✨ Link test complete!');
})();
