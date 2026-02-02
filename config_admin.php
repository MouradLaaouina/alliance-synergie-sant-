<?php
declare(strict_types=1);

return [
    'enabled' => true,
    'username' => 'Mourad',
    'password_hash' => '$2y$10$.jtfx3DLtcZSLTt9LTKnjOsfgmve.2ECzEjFYNxA2haxCmtkGz5hu',
    'session_timeout_minutes' => 30,
    'rate_limit_enabled' => true,
    'rate_limit_max_attempts' => 5,
    'rate_limit_window_minutes' => 10,
    'rate_limit_lock_minutes' => 15,
    'ip_allowlist' => [
        // '127.0.0.1',
        // '203.0.113.10',
    ],
    'trust_proxy' => false,
];
